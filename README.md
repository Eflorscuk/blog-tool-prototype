# blog-tool-prototype

## Goal

This is a blog tool prototype with administrative features, using:

- JavaScript
- Node.js
- Handlebarss
- MongoDB (with Docker)

## Setup

Install all packages in the root of the project:

```npm i```

### Docker

In the root of the project:

#### Build
```docker build -t <name-image> .```

#### Run
```docker run -p 27017:27017 <name-image>```

#### Bash container
```docker exec -it <name-image> bash```
