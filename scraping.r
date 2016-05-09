install.packages("RSelenium") 
library("RSelenium")

checkForServer() 
RSelenium::startServer()
remDr <- remoteDriver(browserName = "chrome")
remDr$open()
startServer(invisible = FALSE, log = FALSE)

startServer(args = c("-port 4455"), log = FALSE, invisible = FALSE)


startServer(args = c("-Dwebdriver.chrome.driver=/Users/Nick/dataProjects/chromedriver.exe"))
