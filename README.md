This is code to automate Sabbath school lessons generatioon from html to markdown for app


# Build

## Build docker image 


'docker build -t sabbath-school-lessons-converter .'


## Run docker container

'docker run sabbath-school-lessons-converter -v docker:/var/lib/sabbath-lessons/'

