const cheerio = require('cheerio');
let fs = require('fs');
//const json2md = require('json2md');
let TurndownService = require('turndown');
let handlebars = require('handlebars');
let { Vibrant } = require('node-vibrant/node');


Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

let turndownService = new TurndownService({
  hr: '---',
  headingStyle: 'atx'
});
//turndownService.use(tables);

turndownService.addRule('italic', {
  filter: function (node) {
    return (
      ['Italic', 'N-dal-Valmistud', 'Lugu-Autor'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return '_' + content.trim().replace(/_/g,'') + '_';
  }
})

turndownService.addRule('question', {
  filter: function (node) {
    return (
      ['P-ev-Loe', 'loe-kysimus', 'P-ev-M-tle', 'Tekst-joon', 'K-simused-Aruteluks', 'Küsimused-Aruteluks'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return '\n\n`' + content.trim() + '`\n\n'
  }
})

turndownService.addRule('sisu', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['Tekst', 'tekst', 'misjonilugu'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return '\n\n' + content + '\n\n'
  }
})

turndownService.addRule('pealkiri', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['title'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    //one sapce after title
    return `title: ${content}`;
  }
});

turndownService.addRule('pealkiri-info', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['title-info'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    //two sapce after title
    return `title:  ${content}`;
  }
});

turndownService.addRule('kuupaev', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['date'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return `date: ${content}`;
  }
});

turndownService.addRule('kuupaev-start', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['start_date'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return `start_date:  ${content}`;
  }
});

turndownService.addRule('kuupaev-end', {
  filter: function (node) {
    //console.log(node.getAttribute('class'));
    return (
      ['end_date'].includes(node.getAttribute('class'))
    )
  },
  replacement: function (content) {
    return `end_date:  ${content}`;
  }
});

turndownService.addRule('oppetykk_info_description', {
  filter: function (node) {
    return (['description'].includes(node.getAttribute('class')))
  },
  replacement: function (content) {
    return `description: '${content}'`;
  }
});

turndownService.addRule('oppetykk_info_human_date', {
  filter: function (node) {
    return (['human_date'].includes(node.getAttribute('class')))
  },
  replacement: function (content) {
    return `human_date: '${content}'`;
  }
});

turndownService.addRule('oppetykk_info_splash', {
  filter: function (node) {
    return (['splash'].includes(node.getAttribute('class')))
  },
  replacement: function () {
    return 'splash: true';
  }
});

turndownService.addRule('oppetykk_color_primary', {
  filter: function (node) {
    return (['color_primary'].includes(node.getAttribute('class')))
  },
  replacement: function () {
    return `color_primary: 'color'`;
  }
});

turndownService.addRule('oppetykk_color_primary_dark', {
  filter: function (node) {
    return (['color_primary_dark'].includes(node.getAttribute('class')))
  },
  replacement: function () {
    return `color_primary_dark: 'color'`;
  }
});



TurndownService.prototype.escape = function (str) {
  // overriding turndown's escape function, whose normal search and
  // replace features to escape special characters is causing pasted
  // markdown text to appear escaped.  This is simply a way of turning it
  // off but may have side effects.
  return str;
}

const loggingEnabled = true;

const months = {
  'jan': '01',
  'veebr': '02',
  'apr': '04',
  'aug': '08',
  'sept': '09',
  'okt': '10',
  'nov': '11',
  'dets': '12',
  'jaanuar': '01',
  'veebruar': '02',
  'märts': '03',
  'aprill': '04',
  'mai': '05',
  'juuni': '06',
  'juuli': '07',
  'august': '08',
  'september': '09',
  'oktoober': '10',
  'november': '11',
  'detsember': '12'
}


function pad(n) {
  return (n < 10) ? ('0' + n) : n;
}

function get_month(date_string) {
  //console.log("Date string " + date_string)
  let regex_months = /\b(jaanuar|veebruar|märts|aprill|mai|juuni|juuli|august|september|oktoober|november|detsember)\b/gi
  return date_string.match(regex_months)[0]
}

function formatDate(date) {
  return [
    pad(date.getDate()),
    pad(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}


//5. õppetükk: 25.–31. jaanuar
//5. õppetükk 25.–31. jaanuar
//5. õptk. 25.–31. jaanuar
//01. õppetükk: 28. märts–3. aprill
// Õptk 25. dets– 31. detsember
function get_date(date_string, year) {
  date_string = date_string.toLowerCase().trim();
  //log(date_string)
  //console.log(date_string)
  let day, month;
  //5. õppetükk: 25.–31. jaanuar
  //if(date_string.includes('õppetükk ') || date_string.includes('õppetükk: ') || date_string.includes('õptk. ')) {

  if (date_string.match(/õpp*e*tü*k*k:*\.* /g)) {
    //let date = (date_string.includes('õppetükk ') || date_string.includes('õppetükk: ') ) ? date_string.split('/õppetükk:* /')[1] : date_string.split('õptk. ')[1]
    let matcher = date_string.match(/õpp*e*tü*k*k:*\.* /g)[0]
    let date = date_string.split(matcher)[1];
    let start_date = date.split('–')[0] || date.split('–')[0]

    if (start_date.includes(' ')) {
      day = start_date.split('. ')[0]
      month = start_date.split(' ')[1]
    } else {
      day = start_date.slice(0, -1);
      month = date.split('–')[1].split(' ')[1]
    }
    //Pühapäev, 26. jaanuar
  } else {
    let day_regex = /\d{1,2}/;
    day = date_string.match(day_regex)[0];
    month = get_month(date_string);
  }
  //return (pad(day.trim()) + '/' + months[month.trim()] + '/' + year).trim();
  return new Date((months[month.trim()] + '/' + pad(day.trim()) + '/' + year).trim());
}

function sanityCheck(obj) {
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'object') {
      sanityCheck(obj[key]);
      return false;
    }

    if (obj[key].length == 0) {
      log(success=false,obj[key])
      log(success=false,"Object size is empty");
      log(obj);
    }
  });
}

function log(success, t) {
  if (loggingEnabled) {
    // If only one argument, treat it as text with default success=true (green)
    if (t === undefined) {
      t = success;
      success = true;
    }
    let color = success ? '\x1b[32m' : '\x1b[31m'; // green for success, red for error
    console.log(color + '%s\x1b[0m', t);
  }
}

function fixDonationArray(donations) {
  const link = '[toeta.advent.ee](https://toeta.advent.ee/)';

  // Ensure first item is placeholder
  donations[0] = 'placeholder';

  // Loop over all items and append link if missing
  for (let i = 1; i < donations.length; i++) {
    if (donations[i] && !donations[i].includes(link)) {
      donations[i] = donations[i].trim() + ' ' + link;
    }
  }

  return donations;
}

function validateArrayLengths(oppetykk) {
  let numberOfWeeks = oppetykk.number_of_weeks;
  let arrays = [
    { name: 'donation', length: oppetykk.donation.length },
    { name: 'sun', length: oppetykk.sun.length },
    { name: 'inside_stories', length: oppetykk.inside_stories.length }
  ];

  arrays.forEach(arr => {
    let expectedLength = numberOfWeeks + 1; // +1 because index 0 is skipped
    if (arr.length === expectedLength) {
      log(true, `${arr.name} array length (${arr.length}) is correct for ${numberOfWeeks} weeks`);
    } else {
      log(false, `${arr.name} array length (${arr.length}) does not match expected (${expectedLength}) for ${numberOfWeeks} weeks`);
    }
  });
}

function getDayData(day) {
  let midagi = $(day).filter(function () {
    let classes = ['Basic-Table', 'P-ev-Loe', 'loe-kysimus', 'P-ev-M-tle', 'Tekst', 'tekst', 'Tekst-joon'];
    let allowedTags = ['ul', 'ol', 'li'];
    console.log($(this).text())
    try {
      let tagName = $(this).prop('tagName').toLowerCase();
      // Include ul/ol/li elements (lists)
      if (allowedTags.includes(tagName) && $(this).text().length > 3) {
        return true;
      }
      let current = $(this).attr('class').split(' ')[0];
      log("BLA " + current)
      return (classes.includes(current) && $(this).text().length > 3)
    } catch (error) {
       console.log('\x1b[31m%s\x1b[0m', error)
       return false;
    }
  })
  return $.html(midagi).replace('Toetav mõte:', '');
}







///////////////////////////////////////
//õppetükk parsing script starts here//
///////////////////////////////////////

 //let path = './docker-mount/oppetukk'
let path = './output/oppetukk';



//  fs.readdir(path, (err, files) => {
//  files.forEach(file => {
//      console.log(file + ' test');
//    });
//  });

//  return -1;

fs.mkdirSync(path);


let text = fs.readFileSync('oppetykk.html', 'utf8');
let templateFile = fs.readFileSync('template/sabath.html', 'utf8');

//delete empty elements &#160; remove <br /> from text
text = text.replace(/<[\w\s=''-:]*>&#160;(<\/\w+>)+/g, '').replace(/<\w+\s*[class='\w+']*><\/\w+>/g, '').replace(/<br \/>/g, '').replace(/<a [\s\w=''\d\.]*\/>/g, '');
// .replace(/<\w+\s*[class='\w+']*><\/\w+>/g, '')
//text = text.replace(/<\w+.*>&#160;(<\/\w+>)+/g, '');

//log(text);

fs.writeFileSync('oppetykk_new.html', text, 'utf8', (err) => {
  log(err);
  if (err) throw err;
  log('The file has been saved!');
});

const $ = cheerio.load(text, {
  decodeEntities: false
});

$.prototype.removeClass = function () {
  //log(this.html());
};

// POC: Extract all elements with id containing "_idContainer" and print text lengths
console.log('\n--- POC: _idContainer text lengths ---');
$('[id^="_idContainer"]').each((index, elem) => {
  let id = $(elem).attr('id');
  let text = $(elem).text().trim();
  let textLength = text.length;
  if (textLength > 0 && textLength < 60) {
    console.log(`${id}: ${textLength} chars - "${text}"`);
  }
});
console.log('--- End POC ---\n');

// POC: Extract title from last element in _idContainer000
let title = $('#_idContainer000').children().last().text().trim();
console.log('--- POC: title from _idContainer000 ---');
console.log(`title: "${title}"`);
console.log('--- End title POC ---\n');

// POC: Extract sun-set times from _idContainers (text length > 5 and < 7)
let sunSet = ['00.00'];
$('[id^="_idContainer"]').each((index, elem) => {
  let text = $(elem).text().trim().replace(/R/g, '');
  if (text.length > 4 && text.length < 10) {
    sunSet.push(text);
  }
});

console.log('--- POC: sun-set array ---');
console.log(sunSet);
console.log('--- End sun-set POC ---\n');

// Validate sunSet array format
console.log('--- Validating sun-set format ---');
const timeFormatRegex = /^\d{2}\.\d{2}$/;
let formatErrors = 0;
sunSet.forEach((time, index) => {
  if (!timeFormatRegex.test(time)) {
    log(false, `sunSet[${index}] = "${time}" - Clock format not correct. Expected format: nn.nn (e.g., 18.45)`);
    formatErrors++;
  }
});
if (formatErrors === 0) {
  log(true, 'All sunSet times are in correct format');
}
console.log('--- End validation ---\n');

// POC: Extract donations from _idContainers starting after _idContainer005
let donations = ['placeholder'];
let startCollecting = false;
$('[id^="_idContainer"]').each((index, elem) => {
  let id = $(elem).attr('id');

  // Start collecting after _idContainer005
  if (id === '_idContainer005') {
    startCollecting = true;
    return; // Skip this element itself
  }

  if (startCollecting) {
    let text = $(elem).text().trim();
    if (text.length > 10 && text.length < 60) {
      // Remove specified characters and trim
      let cleanedText = text
        .replace(/toeta\.advent\.ee/g, '')
        .replace(/€/g, '')
        .replace(/»/g, '')
        .trim();
      donations.push(cleanedText);
    }
  }
});

console.log('--- POC: donations array ---');
donations.forEach((donation, index) => {
  console.log(`donations[${index}]: "${donation}"`);
});
console.log('--- End donations POC ---\n');

let oppetykk = {};
let weeks = [];


oppetykk.newYear = 0;

if($('p.LK-Num').first().clone().text().includes('jaanuar')) {
  oppetykk.newYear = 1;
}

oppetykk.year = $('p.LK-Num').first().clone().text().match(/\d{4}$/g);
oppetykk.human_date = $('p.LK-Num').first().clone().text().replace(/(^|\s)(\p{L})/gu, (_, space, letter) => space + letter.toUpperCase());
oppetykk.data = weeks;
oppetykk.sun = sunSet; // week index starting from 1, first is empty
oppetykk.donation = donations;
oppetykk.donation = fixDonationArray(oppetykk.donation);
oppetykk.start_date = get_date($('p.N-dal-Kuup-ev').first().clone().text(), oppetykk.year - oppetykk.newYear);
oppetykk.end_date = get_date($('p.P-ev-Kuup-ev').last().clone().text(), oppetykk.year);
oppetykk.str_start_date = formatDate(oppetykk.start_date);
oppetykk.str_end_date = formatDate(oppetykk.end_date);
oppetykk.inside_stories = ['place-holder'];
oppetykk.number_of_days = (oppetykk.end_date.getTime() - oppetykk.start_date.getTime()) / (1000 * 3600 * 24) + 1; // ugly +1, end date is midninght time, in milliseconds is one dat less
oppetykk.number_of_weeks =  oppetykk.number_of_days / 7
oppetykk.description = $('p.P-ev-Pealkiri').first().nextAll('p.Tekst').first().text();
oppetykk.title = title;


console.log(oppetykk.sun);
console.log(oppetykk.donation);


// Extract colors from cover.png and generate info.yml
Vibrant.from('cover.png').getPalette().then((palette) => {
  oppetykk.color_primary = palette.Vibrant ? palette.Vibrant.hex : '#000000';
  oppetykk.color_primary_dark = palette.DarkVibrant ? palette.DarkVibrant.hex : '#000000';

  console.log('Extracted colors:', oppetykk.color_primary, oppetykk.color_primary_dark);

  templateFile = fs.readFileSync('template/info.yml', 'utf8');
  let template = handlebars.compile(templateFile);
  let ymlFile = template(oppetykk);

  let fileName = path + '/info.yml';
  fs.writeFile(fileName, ymlFile, 'utf8', (err) => {
    if (err) throw err;
  });

  // Copy cover.png to output directory
  fs.copyFile('cover.png', path + '/cover.png', (err) => {
    if (err) throw err;
    console.log('cover.png copied to output');
  });
}).catch((err) => {
  console.log('\x1b[31m%s\x1b[0m', 'Error extracting colors:', err);
});

$('p.Lugu-Pealkiri').each((id, ref) => {
  let misjonijutt = {};
  misjonijutt.heading = $.text($(ref).first().clone());
  //console.log('----------------');
  //console.log($.html($(ref).first()))
  misjonijutt.content = $.html($(ref).nextUntil('p.N-dal-Kuup-ev').clone());
  oppetykk.inside_stories.push(misjonijutt)
  //console.log('----------------');
});

// Validate array lengths against number of weeks
validateArrayLengths(oppetykk);

//console.log(oppetykk.donation);

//log(oppetykk.donation);
//log(oppetykk.donation.length);

function getWeekData(week_index, start) {
  console.log('WEEK START')
  week_index = week_index + 1;

  fs.mkdirSync(path + '/' + pad(week_index));

  let week = [];
  //let week_ = $(start).nextUntil('p[class=n-kuupaev]').clone();
  let week_ = $(start).nextUntil('p.N-dal-Kuup-ev').clone();


  let laup2ev = {};

  laup2ev.heading = $(week_).first().text().replace(':', ' -').trim();
  laup2ev.week_date = $(start).text();
  laup2ev.date = get_date(laup2ev.week_date, oppetykk.year);
  let control_date = oppetykk.start_date.addDays((week_index - 1) * 7);


  // If sturday date is wrong then put correct date
  if (laup2ev.date.getTime() !== control_date.getTime()) {
    laup2ev.date = control_date;
  }

  // convert to string format dd/mm/yyyy
  laup2ev.date = formatDate(laup2ev.date)

  //laup2ev.kirjakoht = $(week_).next('p[class=n2dal-kirjakoht]').text().replace('Selle nädala õppeaine:','').trim();
  laup2ev.kirjakoht = $(week_).next('p[class=N-dal-Kirjakoht]').text().replace('Selle nädala õppeaine:', '').trim();
  //laup2ev.mlp = $(week_).next('p[class=n2dal-mlp-tekst]').text().replace('Juhtsalm: ','').trim();
  laup2ev.mlp = $(week_).next('p.N-dal-Meelespeetav-salm').text().replace('Juhtsalm: ', '').trim();
  laup2ev.content = $.html($(start).nextUntil('p.P-ev-Kuup-ev').filter(function () {
    return $(this).attr('class') === 'Tekst' || $(this).attr('class') === 'tekst' || $(this).attr('class') === 'N-dal-Valmistud' || $(this).attr('class') == 'P-ev-Loe';
  }));
  laup2ev.title = 'Selle nädala õppeaine';
  //console.log(index)
  //laup2ev.valmistud = $(week_).next('p[class=N-dal-Valmistud]').text() || $.text($(start).nextUntil('p.date').last());
  console.log(laup2ev)
  week.push(laup2ev);
  //console.log(laup2ev);
  week.push();

  templateFile = fs.readFileSync('template/sabath.html', 'utf8');
  let template = handlebars.compile(templateFile);
  let htmlFile = template(laup2ev);
  //log(htmlFile);
  //console.log(htmlFile);
  //return -1;
  let md = turndownService.turndown((htmlFile));

  let fileName = path + `/${pad(week_index)}/01.md`

  templateFile = fs.readFileSync('template/header.yml', 'utf8');
  template = handlebars.compile(templateFile);
  let headerYamlConntent = template(laup2ev);

  try {
    fs.writeFileSync(fileName, headerYamlConntent + md + '\n', 'utf8');
  } catch(err) {
     console.log('\x1b[31m%s\x1b[0m', 'Saturday file save failed')
     console.log('\x1b[31m%s\x1b[0m', err)
  }

  let week_info = {};
  week_info.title = laup2ev.heading;
  week_info.start = laup2ev.date;
  week_info.end = formatDate(control_date.addDays(6));

  templateFile = fs.readFileSync('template/week_info.yml', 'utf8');
  template = handlebars.compile(templateFile);
  yamlFile = template(week_info);
  //md = turndownService.turndown((htmlFile));

  fileName = path + `/${pad(week_index)}/info.yml`

  fs.writeFile(fileName, yamlFile, 'utf8', (err) => {
    if (err)
      throw err;
    else {
        console.log("Writing week info file "+fileName+" Was sucess");
    }
  });

  //console.log(week_)
  $(week_).nextAll('p.P-ev-Kuup-ev').each(function (index) {
    console.log('\x1b[33m%s\x1b[0m', index)
    if ($(this).text().length < 2) {
      console.log("bla");
      return true;
    }

    let p2ev_ = $(this).nextUntil('p.P-ev-Kuup-ev').clone();
    let day = {};

    day.date = get_date($(this).text(), oppetykk.year);
    let day_control_date = oppetykk.start_date.addDays(((week_index - 1) * 7) + index + 1);

    // If date is wrong then calculate correct date
    if (day.date.getTime() !== day_control_date.getTime()) {
      day.date = day_control_date;
    }

    // convert to string format dd/mm/yyyy
    day.date = formatDate(day.date)
    console.log('\x1b[33m%s\x1b[0m', day.date)

    if ($(this).text().includes('Reede')) {
      let friday = $(this).nextUntil('p.Lugu-Pealkiri').clone();
      let kysimused = {};
      day.content = getDayData(friday);
      day.heading = 'Toetav Mõte';
      kysimused.title = 'Küsimused aruteluks:';
      kysimused.content = $(friday).nextAll('p.K-simused-Aruteluks,p.Küsimused-Aruteluks').filter(function () {
        return $(this).text().length > 2;
      }).map(function () {
        let number = $.text($(this).find('span.P-ev-Loe'));
        let $this = $(this)
        $this.find('span.P-ev-Loe').replaceWith(number);
        return $this
      }).get().join('');
      day.arutelu = kysimused;
      console.log(week_index);

      var sun = (oppetykk.sun[week_index] === undefined) ? '' : oppetykk.sun[week_index].trim();
      var donation =  (oppetykk.donation[week_index] === undefined) ? '' : oppetykk.donation[week_index].trim();
      console.log(sun)

      day.p2ike = 'Päikeseloojang ' + sun;
      day.annetus = 'Annetus >> ' + donation;

      let templateFile = fs.readFileSync('template/friday.html', 'utf8');
      let template = handlebars.compile(templateFile);
      let htmlFile = template(day);
      let md = turndownService.turndown((htmlFile));

      let fileName = path + `/${pad(week_index)}/${pad(index + 2)}.md`

      templateFile = fs.readFileSync('template/header.yml', 'utf8');
      template = handlebars.compile(templateFile);
      let headerYamlConntent = template(day);


      fs.writeFile(fileName, headerYamlConntent + md + '\n', 'utf8', (err) => {
        if (err) throw err;
      });

      if (oppetykk.inside_stories[week_index].content == '' || typeof oppetykk.inside_stories[week_index].content === 'undefined') {
        console.log('\x1b[31m%s\x1b[0m', 'Misjonilugu broken in ' + day.date)
      }

      day.misjonilugu = oppetykk.inside_stories[week_index];
      day.heading = 'Misjonilugu';

      headerYamlConntent = template(day);

      templateFile = fs.readFileSync('template/inside-story.html', 'utf8');
      template = handlebars.compile(templateFile);
      htmlFile = template(day);

      md = turndownService.turndown((htmlFile));

      fileName = path + `/${pad(week_index)}/inside-story.md`

      fs.writeFile(fileName, headerYamlConntent + md + '\n', 'utf8', (err) => {
        if (err) throw err;

      });

    } else {
      day.heading = $(p2ev_).first().text().replace(':', ' -').trim();
      day.content = getDayData(p2ev_);
      //console.log(day.content)

      templateFile = fs.readFileSync('template/day.html', 'utf8');
      let template = handlebars.compile(templateFile);
      let htmlFile = template(day);
      //console.log(htmlFile)
      let md = turndownService.turndown((htmlFile));
      //console.log(md);
      let fileName = path + `/${pad(week_index)}/${pad(index + 2)}.md`

      templateFile = fs.readFileSync('template/header.yml', 'utf8');
      template = handlebars.compile(templateFile);
      let headerYamlConntent = template(day);

      try {
        fs.writeFileSync(fileName, headerYamlConntent + md + '\n', 'utf8');
      } catch(err) {
         console.log('\x1b[31m%s\x1b[0m', err)
      }
      //fs.writeFile(fileName, md, 'utf8', (err) => {
      //  if (err) throw err;
      //});
    }
    week.push(day);
  });

  for (const day of week) {
    if (day.contet == '' || typeof day.content === 'undefined') {
      console.log('\x1b[31m%s\x1b[0m', 'Day content not detected ' + day.date)
    }
  }

  if (week.length != 7) {
    console.log('\x1b[31m%s\x1b[0m', 'Week length ' + week.length);
    console.log('\x1b[31m%s\x1b[0m', 'Some days not detected in week ' + (weeks.length + 1));
  }
  weeks.push(week);
}

$('p.N-dal-Kuup-ev').each(function (index, elem) {
  getWeekData(index, elem);
});

sanityCheck(oppetykk);
//log(JSON.stringify(oppetykk))
let json = JSON.stringify(oppetykk);
fs.writeFile(path + '/oppetykk.json', json, 'utf8', (err) => {
  if (err) throw err;
  log('The json file has been saved!');
});
//log(JSON.stringify(oppetykk.data[0][2].heading))
