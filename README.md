## Release Notes HEMA ScoreCut v1.0
### NEW FEATURES 

  * Adding and removing points (mobile) 
 

  * Adding and removing warnings and penalties (mobile) 
 

  * Customizable timer (mobile) 
 

  * Undo functionality for warnings and penalties (desktop and mobile) 
 

  * Removed required dependencies on Docker by converting to executable (desktop) 
 

  * Database tracks changes to timer (desktop and mobile)<br/><br/> 

 

### BUG FIXES

  * Mobile Application:

    * Constant updating of the current timestamps of all matches no longer causes a memory leak due to the flood of excess time updates every 80 milliseconds to the database. 

    * Selecting a match no longer inhibits users from returning to the match selection screen to select a different match. 

  * Desktop Application:

    * Warnings produced on startup unrelated to the current instance of the application have been removed. 

    * CSV exporter no longer crashes the application. 

    * If the user assigns a point to one competitor and no points to the other competitor, the page correctly refreshes.<br/><br/> 

 

### KNOWN BUGS  

  * The desktop application contains links that do not allow for the user to navigate to the application. 

  * Desktop version is periodically unable to recognize when warnings are undone from the mobile app. 

  * Desktop version is periodically unable to recognize when time is added to the timer on mobile app. 

  * No official login feature that track names of which referee makes changes to a match.<br/><br/> 

 

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

    * Acquire [MySQL](https://dev.mysql.com/downloads/mysql/), preferably a version below 8.0

    * Acquire any available version of [MySQL Workbench CE](https://dev.mysql.com/downloads/workbench/)
 

  * Python: 

    * Acquire the latest version of [Python 3.xx](https://www.python.org/downloads/) 
 

  * Download the mysql connector using the command `pip install mysql-connector-python`<br/><br/>
 

### DOWNLOAD INSTRUCTIONS  

  * Desktop Application: 

    * Navigate to the JID-0338 GitHub repository and select the [PHPDesktop folder](https://github.com/Cholmes24/JID-0338/tree/master/PHPDesktop) 

    * Download the HEMAScorecardClientInstaller.exe from GitHub. 

    * Download the SQLInitScript.sql from GitHub. 

  * Python Connection Handler: 

    * Navigate to the JID-0338 GitHub repository and select the [Web API Server folder](https://github.com/Cholmes24/JID-0338/tree/master/Web%20API%20Server) 

    * Download the interfacedbAPIv2.py file. 

  * Python Flask: 

    * Open a command prompt and use the command `pip install flask` 

  * Mobile Application (via Expo Go):

    * Download either Expo Go from the Apple App Store or Expo from the Google Play Store. 

    * Navigate to the JID-0338 GitHub repository and select the [React Front End folder](https://github.com/Cholmes24/JID-0338/tree/master/React%20Front%20End). Download this folder.<br/><br/>
 

### BUILD INSTRUCTIONS 

  * MySQL Server:  

    * Open your preferred database viewing tool such as MySQL Workbench 

    * Click on the Local instance router and log in 

    * Once connected, ensure the server is running by navigating on the toolbar to the Server → Server Status.  

    * If not connected, navigate to Server → Startup/Shutdown and start the server. 

    * Once the server is confirmed to be running, navigate to File → Open SQL Script.  

    * Select ‘SQL Init Script.sql.’  

    * Execute the contents of the file to build the scorecardv5 database structure. (If using MySQL Workbench, click the lightning bolt symbol located at the top of the SQL prompt.)<br/><br/>
 

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

  * Python Connection Handler: 

    * Open a command prompt window and navigate to the directory where the interfacedbAPIv2.py file is located. 

    * Run the file with the command `python interfacedbAPIv2.py` 
 

  * Desktop Application: 

    * Double click HEMAScorecardClient.exe (or click the desktop shortcut) to run the application. 
 

  * Mobile Application: 

    * Navigate to the downloaded JID-0338/React Front End folder in the command line and run the command `expo start`

    * This will open a window in the browser that contains a QR code.  

    * Scan this code with the camera on your mobile device and the app will begin in Expo Go.<br/><br/>

 

### TROUBLESHOOTING   

   * This error can occur if the user types pip install mysql-connector instead of `pip install mysql-connector-python`. Ensure to use the latter. 

       > Authentication Plugin: caching-sha2_password cannot be loaded

       * If that does not fix the problem, then locate the my.ini file which should be located in the ProgramData\MySQL\MySQL Server 5.7 on your main drive. 

       * Open the configuration file and add the lines that follow underneath the corresponding headers: 

            Header: `[client]`

                default-character-set=utf8 

            Header: `[mysql]`

                default-character-set=utf8

            Header: `[mysqld]` 

                default-authentication plugin=mysql_native_password

                character-set-server = utf8

  * Errors when trying to run a pip command 

    * You may not have acquired the most up-to-date version of Python, which includes [pip](https://pip.pypa.io/en/stable/installing/). 

  * Errors while connecting with the mobile application 

    * Ensure to complete the steps to run the Python Connection Handler and start up MySQL Server before attempting to connect with the mobile application. 
 
