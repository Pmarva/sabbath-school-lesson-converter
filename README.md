This is code to automate Sabbath school lessons generatioon from html to markdown for app


# Build

## Build docker image 

```
docker build -t sabbath .
```


## Run docker container

```
docker run -v $(pwd):/var/lib/sabbath-lessons/ sabbath
```


### Files are generate to docker-mount folder

```
marvin@marvin-ThinkPad-X13-Gen-1:~/git/sabbath-school-lesson-converter$ tree docker-mount/
docker-mount/
├── oppetukk
│   ├── 01
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 02
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 03
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 04
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 05
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   └── info.yml
│   ├── 06
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   └── info.yml
│   ├── 07
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 08
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 09
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   └── info.yml
│   ├── 10
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   └── info.yml
│   ├── 11
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 12
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   ├── 13
│   │   ├── 01.md
│   │   ├── 02.md
│   │   ├── 03.md
│   │   ├── 04.md
│   │   ├── 05.md
│   │   ├── 06.md
│   │   ├── 07.md
│   │   ├── info.yml
│   │   └── inside-story.md
│   └── info.yml
└── oppetukk.zip

14 directories, 111 files
```
