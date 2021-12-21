def buildApp() {
    sh "npm install"
}

def testApp() {
    echo "building the docker image"
    withCredentials([
        usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'PASS', usernameVariable: 'USER')
    ]) {
        sh "docker build -t e-comm ."
        sh "echo $PASS | docker login -u $USER -p $PASS docker.io"
        sh "docker push e-comm"
    }
}

def deployApp() {
    echo "deploying the application..."
}

return this
