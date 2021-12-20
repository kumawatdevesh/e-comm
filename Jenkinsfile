pipeline {
  
  agent any 
  
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
