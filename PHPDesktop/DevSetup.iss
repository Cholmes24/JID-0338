; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{FE94CEED-6034-4A23-A185-EB8B6A3D651F}
AppName=HEMAScorecardClient
AppVersion=0.0.1
;AppVerName=HEMAScorecardClient 0.0.1
AppPublisher=JID-0338
DefaultDirName={autopf}\HEMAScorecardClient
DisableProgramGroupPage=yes
LicenseFile=C:\Users\mrxcr\Gatech\Spring 2021\Junior Design\JID-0338\PHPDesktop\phpdesktop-chrome-57.0-rc-php-7.1.3 (2)\phpdesktop-chrome-57.0-rc-php-7.1.3\license.txt
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
OutputDir=C:\Users\mrxcr\Gatech\Spring 2021\Junior Design\JID-0338\PHPDesktop
OutputBaseFilename=HEMAScorecardClientInstaller
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "C:\Users\mrxcr\Gatech\Spring 2021\Junior Design\JID-0338\PHPDesktop\phpdesktop-chrome-57.0-rc-php-7.1.3 (2)\phpdesktop-chrome-57.0-rc-php-7.1.3\phpdesktop-chrome.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mrxcr\Gatech\Spring 2021\Junior Design\JID-0338\PHPDesktop\phpdesktop-chrome-57.0-rc-php-7.1.3 (2)\phpdesktop-chrome-57.0-rc-php-7.1.3\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\HEMAScorecardClient"; Filename: "{app}\phpdesktop-chrome.exe"
Name: "{autodesktop}\HEMAScorecardClient"; Filename: "{app}\phpdesktop-chrome.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\phpdesktop-chrome.exe"; Description: "{cm:LaunchProgram,HEMAScorecardClient}"; Flags: nowait postinstall skipifsilent

