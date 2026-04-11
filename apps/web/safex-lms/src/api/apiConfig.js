const environments = {
    local: "local",
    cloud: "cloud",
}


const selectedEnvironment = environments.cloud;

const baseUrls = {
    local: "http://localhost:3005",
    cloud: "https://safex-etoa-bfe43e95d66f.herokuapp.com"

   
}

export default baseUrls[selectedEnvironment];