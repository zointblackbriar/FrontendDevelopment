#include <iostream>
#include <stdlib.h>
int main()
{
  if(system("find . -name 'node_modules' ") != -1)
  {
	std::cout << "module founded" << std::endl;
        //no need to call npm install 
        //start the modules
        system("npm start & ");
        system("google-chrome 'http://localhost:2800'");
                
//open google chrome 
        
  } else
  {
     system("npm install");
     system("wait $!");
     system("npm start &");
     system("google-chrome 'http://localhost:2800'");
  }

return 0;
}
