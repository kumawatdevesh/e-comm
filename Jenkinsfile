pipeline {
  
  agent any 
  
  environment {
    NEW_VERSION = '1.2.3'
    SERVER_CREDENTIALS = credentials('61211a2a-29fa-49e6-b546-2e92fe45f5ad') 
  }
  
  stages {
    
    stage("build") {
      
      when {
        expression {
          BRANCH_NAME = 'dev'
        }
      }
      
      steps {
        echo "building the application..."
      }
    }
    
    stage("test") {
      
      steps {
        sh "npm install"
        echo "testing the application..."
      }
    }
    
    stage("deploy") {
      
      steps {
        echo "deploy the application..."
      }
    }
  }
}
