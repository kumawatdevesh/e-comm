def buildApp() {
    sh "npm install"
}

def testApp() {
    echo "building the docker image"
    withCredentials([
        usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'PASS', usernameVariable: 'USER')
    ]) {
        sh "docker build -t kumawatdevesh99/e-comm:latest ."
        sh "echo $PASS | docker login -u $USER -password-stdin"
        sh "docker push kumawatdevesh99/e-comm:latest"
    }
}

def deployApp() {
    echo "deploying the application..."
}

return this
