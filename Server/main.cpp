
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
#include <operations.hpp>
#include <io.hpp>

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
#include <map>
#include <vector>
#include <string.h> 
#include <iostream> 

#define PORT 8080 

using namespace std;
using namespace ba_graph;
using namespace httpparser;

json datab_mult(){
	std::ifstream in("array_of_multipoles.txt");
	json m;
	in >> m;
	in.close();
	return m;
}

/*class GraphBuilder{
	
	Graph g = createG();       	
	json info;
	json m;
	std::map<int, Number> map_of_vert;
	std::map<pair<int, std::string>, Number> map_of_mult;
	int c = 0;//Number, moze byt aj int skusal som  int
	
	public:
	GraphBuilder(json data){
		m = datab_mult();
		info = data;
	}
	
	Graph & make_graph(){
		for (auto& e : info["vertices"]) {
			c++;
			int v = std::stoi(e.get<std::string>());
			map_of_vert[v] = c;
			addV(g, c);
		}
		for (auto& e : info["multipoles"]) {
			for (auto& j : m) {
				if(e["name"] == j["name"]){
					Graph multipol = read_sparse6(j["underlying_graph"].get<std::string>().begin(), j["underlying_graph"].get<std::string>().end());
					int min_n = min_offset(g);
					add_graph(g, multipol, min_n);
					int id = std::stoi(e["id"].get<std::string>());
					for (auto& k : j["dangling_edges_mapping"]) {
						for (auto& l : k.items()) {
							//string v = 
							c++;//
							map_of_mult[{ id, l.key() }] = c + min_n;  			//asi std::stoi(l.value().get<std::string>());
						}	
					}						
					break;
				}	
			}
		}	
		
		for (auto& e : info["edges"]) {
			if(e["first"]["type"] == "multipol" && e["second"]["type"] == "vertex"){
				int index1 = std::stoi(e["first"]["id"].get<std::string>());
				std::string index2 = e["first"]["dangling_edge"].get<std::string>();
				Number vertex1 = map_of_vert[std::stoi(e["second"]["id"].get<std::string>())];
				Number vertex2 = map_of_mult[{ index1, index2 }];								//moze byt aj int ?	
				identify_vertices(g, vertex1, vertex2); 
			}else if(e["second"]["type"] == "multipol" && e["first"]["type"] == "vertex"){
				int index1 = std::stoi(e["second"]["id"].get<std::string>());
				std::string index2 = e["second"]["dangling_edge"].get<std::string>();
				Number vertex1 = map_of_vert[std::stoi(e["first"]["id"].get<std::string>())];
				Number vertex2 = map_of_mult[{ index1, index2 }];
				identify_vertices(g, vertex1, vertex2);			
			}else if(e["first"]["type"] == "multipol" && e["second"]["type"] == "multipol"){
				int index1a = std::stoi(e["first"]["id"].get<std::string>());
				std::string index2a = e["first"]["dangling_edge"].get<std::string>();
				int index1b = std::stoi(e["second"]["id"].get<std::string>());
				std::string index2b = e["second"]["dangling_edge"].get<std::string>();			
				Number vertex1 = map_of_mult[{ index1a, index2a }];
				Number vertex2 = map_of_mult[{ index1b, index2b }];		
				identify_vertices(g, vertex1, vertex2);
				suppress_vertex(g, vertex1);
			}else if(e["first"]["type"] == "vertex" && e["second"]["type"] == "vertex"){
				int v1 = std::stoi(e["first"]["id"].get<std::string>(););
				int v2 = std::stoi(e["second"]["id"].get<std::string>(););
				addE(g, Location(map_of_vert[v1], map_of_vert[v2]));
			}else{	
				string str="HTTPS/1.1 404 NOT FOUND\nAccess-Control-Allow-Origin: http://localhost:4200\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
				const char * resp = str.c_str();
				send(new_socket, resp, strlen(resp), 0);			
			}
		}
		return g;
	}
};*/

int main(int argc, char const *argv[]) {
	
    int server_fd, new_socket, valread;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof (address);
    char buffer[800000] = {0};
  
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
	
    valread = read(new_socket, buffer, 800000);
	printf("%s\n", buffer);//
	
	Request request;
    HttpRequestParser parser;
	HttpRequestParser::ParseResult res = parser.parse(request, buffer, buffer + sizeof(buffer));
	
	//std::cout << request.inspect() << std::endl;
	std::cout << request.method << std::endl;//
	std::cout << request.uri << std::endl;//
	
	std::string data(request.content.begin(), request.content.end());
	std::cout << data << std::endl;//
	//json info = json::parse(data);
	
	if(request.method == "POST"){
		if(request.uri.compare(0,6,"/graph")==0){
			/*GraphBuilder gb(info);
			Graph g = gb.make_graph();
			
			std::string s =	write_sparse6(g);
		
			string str="HTTPS/1.1 200 OK\nAccess-Control-Allow-Origin: http://localhost:4200\nContent-Type: text/plain\n\n" + s;
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);*/
		}else if (request.uri.compare(0,6,"/close")==0){//
			//break;//
		}else{
			string str="HTTPS/1.1 404 NOT FOUND\nAccess-Control-Allow-Origin: http://localhost:4200\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>"; //treba aj davat telo ?
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);		
		}
	}else if(request.method == "GET"){
		if(request.uri.compare(0,9,"/multipol")==0){
			json m = datab_mult();
			std::string s = m.dump();
					
			string str="HTTPS/1.1 200 OK\nAccess-Control-Allow-Origin: http://localhost:4200\nContent-Type: application/json\n\n" + s;
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);	
		}else if (request.uri.compare(0,11,"/invariants")==0){
			/*Graph g = read_sparse6(data);
			json h;
			h["girth"]=girth(g);
			max_deg;
			min_deg;
			ak su 3 aj max a min tak cyclic_connectivity;
			std::string s = m.dump();*/
		}else if (request.uri.compare(0,6,"/close")==0){//
			//break;//
		}else{
			string str="HTTPS/1.1 404 NOT FOUND\nAccess-Control-Allow-Origin: http://localhost:4200\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);		
		}
	}	
    //}//
    return 0;
}





