
/* 
 * File:   main.cpp
 * Author: Filip
 *
 * 
 */

/*#include <snarks/colouring_pd.hpp>
#include <graphs/snarks.hpp>
#include <random/random_graphs.hpp>
#include <path_decomposition/shortest_path_heuristic.hpp>
#include <snarks/colouring_pd.hpp>*/ 

#include <basic_impl.hpp>
#include <invariants.hpp>
#include <graphs.hpp>
#include <config/configuration.hpp>
#include <util/json.hpp>

#include "httprequestparser.h"
#include "request.h"

#include <cassert>
#include <sstream>
#include <iomanip>

#include <unistd.h> 
#include <stdio.h> 
#include <sys/socket.h> 
#include <stdlib.h> 
#include <netinet/in.h> 
#include <string.h> 
#include <iostream> 

#define PORT 8080 

using namespace std;
using namespace ba_graph;
using namespace httpparser;

int n=3; //pocet multipolov

int main(int argc, char const *argv[]) {
	Graph gr=create_isaacs(11);            //pouzivanie na skusku nieco z ba_graphu
	std::cout << max_deg(gr) << std::endl;
	
    int server_fd, new_socket, valread;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof (address);
    char buffer[300000] = {0};

   
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

 
    if (bind(server_fd, (struct sockaddr *) &address, sizeof (address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    if (listen(server_fd, 3) < 0) //pocuva az 3 requesty naraz
    {
        perror("listen");
        exit(EXIT_FAILURE);
    }
	
     //while(1){ // 

    if ((new_socket = accept(server_fd, (struct sockaddr *) &address,
            (socklen_t*) & addrlen)) < 0) {
        perror("accept");
        exit(EXIT_FAILURE);
    }
	//
	std::ifstream in("pole_multipolov.txt");
	json m;
	in >> m;
	//std::string s = m.dump();
	//std::cout << m[1]["dangling_edges_mapping"][0] << std::endl;
	//
	
    valread = read(new_socket, buffer, 300000);
	printf("%s\n", buffer);
	
	Request request;
    HttpRequestParser parser;
	HttpRequestParser::ParseResult res = parser.parse(request, buffer, buffer + sizeof(buffer));
	
	//std::cout << request.inspect() << std::endl;
	std::cout << request.method << std::endl;
	std::cout << request.uri << std::endl;
	std::string data(request.content.begin(), request.content.end());
	std::cout << data << std::endl;
	
	//json inf= json::parse(data);
	
	if(request.uri.compare(0,6,"/graph")==0){
		bool b = true;
		/*Graph g = createG();
		int i;
		for (auto& element : inf["vertices"]) {
			addV(g, element);
	    }
		for (auto& element : m) {
			if(element["name"]==inf){
				b = false;
			}
		}
		if(b){
		string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
		const char * odpoved = str.c_str();
		send(new_socket, odpoved, strlen(odpoved), 0);
		}
		write_sparse6(g);
		*/
		string str="HTTPS/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 12\n\nHello world!";
		const char * odpoved = str.c_str();
		send(new_socket, odpoved, strlen(odpoved), 0);
	}else if (request.uri.compare(0,10,"/multipole")==0){
		
		string str="HTTPS/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 12\n\nHello world!";
		const char * odpoved = str.c_str();
		send(new_socket, odpoved, strlen(odpoved), 0);
		
	}else if (request.uri.compare(0,12,"/favicon.ico")==0){
	
	}else if (request.uri.compare(0,6,"/close")==0){
		in.close();
		//break;
	}else{
		string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
		const char * odpoved = str.c_str();
		send(new_socket, odpoved, strlen(odpoved), 0);		
	}
	
    //}//
    return 0;
}





