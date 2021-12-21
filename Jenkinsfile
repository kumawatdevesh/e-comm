pipeline {
    agent any 

    environment {
        NEW_VERSION="1.2.0"
        SERVER_CREDENTIALS=credentials('61211a2a-29fa-49e6-b546-2e92fe45f5ad')
    }

    stages {
        stage("build") {
            when {
                expression {
                    BRANCH_NAME == 'dev'
                }
            }

            steps {
                echo "building the applictaion... ${NEW_VERSION}"
            }
        }

        stage("test") {
            steps {
                echo "testing the application... and ${SERVER_CREDENTIALS}"
            }
        }

        stage("deploy") {
            steps {
                echo "deploying the application..."
            }
        }
    }
}
