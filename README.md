## Release Notes HEMA ScoreCut v1.0
### NEW FEATURES 

  * Adding and removing points (mobile) 
 

  * Adding and removing warnings and penalties (mobile) 
 

  * Customizable timer (mobile) 
 

  * Undo functionality for warnings and penalties (desktop and mobile) 
 

  * Removed required dependencies on Docker by converting to executable (desktop) 
 

  * Database tracks changes to timer (desktop and mobile)  


  * Authorization tokens and access codes used to maintain user sessions<br/><br/> 

 

### BUG FIXES

  * Mobile Application:

    * Constant updating of the current timestamps of all matches no longer causes a memory leak due to the flood of excess time updates every 80 milliseconds to the database. 

    * Selecting a match no longer inhibits users from returning to the match selection screen to select a different match. 

  * Desktop Application:

    * Warnings produced on startup unrelated to the current instance of the application have been removed. 

    * CSV exporter no longer crashes the application. 

    * If the user assigns a point to one competitor and no points to the other competitor, the page correctly refreshes.

    * Tokens are now correctly checked before allowing the user to change score.<br/><br/> 

 

### KNOWN BUGS  

  * The desktop application contains links that do not allow for the user to navigate to the application. 

  * Desktop version is periodically unable to recognize when warnings are undone from the mobile app. 

  * Desktop version is periodically unable to recognize when time is added to the timer on mobile app. <br/><br/> 

 

## Install Guide HEMA ScoreCut v1.0  

### PRE-REQUISITES 

  * Network Connectivity: 

    * A LAN Connection that mutually connects to the chosen desktop machine and the relevant mobile devices. 
 

  * Desktop Application: 

    * The user must have a Windows machine or a machine that utilizes a virtual machine that can host a Windows operating system.  

    * Access to command prompt and ability to execute ipconfig command to find IPv4 router IP address. 
 

  * Mobile Application: 

    * The user must have an iOS or Android mobile phone.<br/><br/>

### DEPENDENCIES 

  * MySQL: 

    * Acquire [MySQL](https://dev.mysql.com/downloads/mysql/), preferably a version below 8.0.

    * Acquire any available version of [MySQL Workbench CE](https://dev.mysql.com/downloads/workbench/).
 

  * Python: 

    * Acquire the latest version of [Python 3.xx](https://www.python.org/downloads/).
 

  * Download the mysql connector using the command `pip install mysql-connector-python`<br/><br/>
 

### DOWNLOAD INSTRUCTIONS  

  * Desktop Application: 

    * Navigate to the JID-0338 GitHub repository and select the [PHPDesktop folder](https://github.com/Cholmes24/JID-0338/tree/master/PHPDesktop). 

    * Download the HEMAScorecardClientInstaller.exe from GitHub. 

    * Download the SQLInitScript.sql from GitHub. 

  * Connection Handler: 

    * Navigate to the JID-0338 GitHub repository and select the [ScoreCut folder](https://github.com/Cholmes24/JID-0338/tree/master/Web%20API%20Server/ScoreCut). 

    * Download the files in this folder, including access_management.py, app.py, and config.py. 

  * Python Flask: 

    * Open a command prompt and use the command `pip install flask` 

  * Mobile Application (via Expo Go):

    * Download either Expo Go from the Apple App Store or Expo from the Google Play Store. 

    * Navigate to the JID-0338 GitHub repository and select the [React Front End folder](https://github.com/Cholmes24/JID-0338/tree/master/React%20Front%20End). Download this folder.<br/><br/>
 

### BUILD INSTRUCTIONS 

  * MySQL Server:  

    * Open your preferred database viewing tool such as MySQL Workbench. 

    * Click on the Local instance router and log in. 

    * Once connected, ensure the server is running by navigating on the toolbar to the Server → Server Status.  

    * If not connected, navigate to Server → Startup/Shutdown and start the server. 

    * Once the server is confirmed to be running, navigate to File → Open SQL Script.  

    * Select ‘SQL Init Script.sql.’  

    * Execute the contents of the file to build the scorecardv5 database structure (If using MySQL Workbench, click the lightning bolt symbol located at the top of the SQL prompt).<br/><br/>
 

### INSTALLATION INSTRUCTIONS  

  * Desktop Application: 

    * Double click on the HEMAScoreCardClientInstaller.exe that has been downloaded from GitHub. 

    * If a Windows Security popup appears, click More Info → Run Anyway. 

    * Continue through the steps of the installation setup. Once complete, you should have access to HEMAScorecardClient.exe. 

  * Mobile Application: 

    * Install [npm](https://www.npmjs.com/get-npm) on your machine.  

    * Install yarn by typing in the command `npm install yarn`

    * Navigate to the downloaded JID-0338/React Front End folder in the command line and type in the command `yarn`

    * Install the expo client by using the command `npm install -g expo-cli`<br/><br/>  

 

### RUNNING APPLICATION   

  * Connection Handler: 

    * Before connecting, replace the sample username and password in config.py with your credentials to the scorecardv5 database. 

        This includes changing the user in config.py: line 29 and changing the DB_PASSWORD in .env.sample: line 1. 
        
        Note that this is a sample .env file and we highly suggest creating your own .env file to store your environment variables. 
        
        If you choose to create a new .env, be sure to change config.py: line 7 from `load_dotenv(path.join(basedir, '.env.sample'))` to `load_dotenv(path.join(basedir, '.env'))`

    * Open a command prompt window and navigate to the directory where the app.py file is located. 

    * Run the file with the command `python app.py` 
 

  * Desktop Application: 

    * Double click HEMAScorecardClient.exe (or click the desktop shortcut) to run the application. 

    * Access Code: visit the [url](http://localhost:5000/api/generate) or submit a GET request to localhost:5000/api/generate using Postman. This will generate an access code and print it on the console that is running the Connection Handler (app.py).

 

  * Mobile Application: 

    * Navigate to the downloaded JID-0338/React Front End folder in the command line and run the command `expo start --no-dev` to run expo in production mode.

    * This will open a window in the browser that contains a QR code.  

    * Scan this code with the camera on your mobile device and the app will begin in Expo Go.

    * Once the app starts up, you will be prompted to enter a 7-digit access code.

    * Type in the access code that was generated and printed to the console (see Desktop Application step above).

    * You should now have a live connection to the system and be able to record scores!<br/><br/>

 

### TROUBLESHOOTING   

   * This error can occur if the user mistakenly types pip install mysql-connector.

       > Authentication Plugin: caching-sha2_password cannot be loaded

       * Ensure to instead use `pip install mysql-connector-python`

       * If that does not fix the problem, then locate the my.ini file which should be in the ProgramData\MySQL\MySQL Server 5.7 on your main drive. 

       * Open the my.ini configuration file. 

       * Ensure the character set and authentication plugin settings match by checking the following lines:

            Header: `[client]`

                default-character-set=utf8 

            Header: `[mysql]`

                default-character-set=utf8

            Header: `[mysqld]` 

                default-authentication plugin=mysql_native_password

                character-set-server=utf8
                  

  * Errors when trying to run a pip command
    > 'pip' is not recognized as an internal or external command

    * You may not have acquired the most up-to-date version of Python, which includes [pip](https://pip.pypa.io/en/stable/installing/).  


  * Errors while connecting with the mobile application 

    * Ensure to complete the steps to run the Connection Handler and start up MySQL Server *before* attempting to connect with the mobile application.  


   * This error can occur if you are missing the correct React networking module. 

       > Unable to resolve module @react-native-community/netinfo

       * To fix this error, use the following command:
         `yarn add @react-native-community/netinfo`  
   
   
   * This error can occur if downloading any files caused CurrentIDsReducer to be renamed as CurrentIdsReducer.

     > Failed building JavaScript bundle.
     > Unable to resolve module ../reducers/CurrentIDsReducer

     * To fix this error, ensure that the following lines are consistent with their naming. 

          store.ts: line 10
       
          TournamentsScreen.tsx: line 10
       
          PoolsScreen.tsx: line 6
       
          SystemEventsScreen.tsx: line 10
       
          MatchesScreen.tsx: line 11
       
       
      * For instance, `import { setCurrentTournamentID } from '../reducers/CurrentIdsReducer'`
       
          should be changed to: `import { setCurrentTournamentID } from '../reducers/CurrentIDsReducer'`
          
   * This error may occur if the user tries to use an access code that has timed out.
    
     > KeyError: datetime.datetime(2021, 4, 28, 18, 41, 44, 724257)
    
     * In this case, you may need to restart the connection handler with `python app.py` and generate a new access code.

