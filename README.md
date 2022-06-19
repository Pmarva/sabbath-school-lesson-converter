This is code to automate Sabbath school lessons generatioon from html to markdown for app


# Build

## Build docker image 

```
docker build -t sabbath .
```


## Run docker container

```
docker run -v $(pwd):/var/lib/sabbath-lessons/ sabbath```


### And files are generate to docker-mount folder
