def gv


pipeline {
    agent any 

    environment {
        NEW_VERSION="1.2.0"
        SERVER_CREDENTIALS=credentials('61211a2a-29fa-49e6-b546-2e92fe45f5ad')
    }

    parameters {
        string(name: 'VERSION', defaultValue: '', description: 'This is a test value')
        choice(name: 'VERSION', choices: ['1.2.0', '1.3.0', '1.4.0'], description: "This is version choice")
        booleanParam(name: 'executeTest', defaultValue: true, description: "excute test or not")
    }

    stages {

        stage("init") {
            steps {
                script {
                    gv = load "script.groovy"
                }
            }
        }

        stage("build") {
            steps {
                script {
                    gv.buildApp()
                }
            }
        }

        stage("test") {
            steps {
                script {
                    gv.testApp()
                }
            }
        }

        stage("deploy") {
            steps {
                script {
                    gv.deployApp()
                }
            }
        }
    }
}
