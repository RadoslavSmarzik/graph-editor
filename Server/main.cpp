
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
#include <map>
#include <string.h> 
#include <iostream> 

#define PORT 8080 

using namespace std;
using namespace ba_graph;
using namespace httpparser;

json datab_mult(){
	std::ifstream in("pole_multipolov.txt");
	json m;
	in >> m;
	in.close();
	return m;
}

int main(int argc, char const *argv[]) {
	Graph gr=create_isaacs(11);            //pouzivanie na skusku nieco z ba_graphu
	std::cout << max_deg(gr) << std::endl;//
	
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
	std::cout << request.method << std::endl;
	std::cout << request.uri << std::endl;
	std::string data(request.content.begin(), request.content.end());
	std::cout << data << std::endl;
	
	//json inf= json::parse(data);//
	
	if(request.method == "POST"){
		if(request.uri.compare(0,6,"/graph")==0){
			json m = datab_mult();
			map<pair<int, int>, int> map;
			int	c = 0;		
			/*Graph g = createG();
		
			for (auto& e : inf["vertices"]) {
				c++;
				map[{ 0, e }] = c;
				addV(g, c);
			}
			for (auto& e : inf["edges"]) {
				if(e["first"]["type"] == "multipol" && e["second"]["type"] == "vertex"){
					for (auto& j : inf["multipoles"]) {
						if(j["id"] == e["first"]["id"]){
							for (auto& k : m) {
								if(j["name"] == k["name"]){
									for (auto& l : k["dangling_edges_mapping"]) {
										if(l[e["first"]["dangling_edge"]] != nullptr){
											if(map[{ j["id"], l[e["first"]["dangling_edge"]] }] == 0){
												c++;
												map[{ j["id"], l[e["first"]["dangling_edge"]] }] = c;
											}	
											//addE(k["dangling_edges_mapping"][e["first"]["dangling_edge"]], e["second"]["id"]);
											break;
										}	
									}
									break;
								}	
							}
							break;
						}
					}									
				}else if(e["second"]["type"] == "multipol" && e["first"]["type"] == "vertex"){
					for (auto& j : inf["multipoles"]) {
						if(j["id"] == e["second"]["id"]){
							for (auto& k : m) {
								if(j["name"] == k["name"]){
									for (auto& l : k["dangling_edges_mapping"]) {
										if(l[e["second"]["dangling_edge"]] != nullptr){
											if(map[{ j["id"], l[e["second"]["dangling_edge"]] }] == 0){
												c++;
												map[{ j["id"], l[e["second"]["dangling_edge"]] }] = c;
											}	
											//addE(k["dangling_edges_mapping"][e["first"]["dangling_edge"]], e["second"]["id"]);
											break;
										}	
									}							
									break;
								}	
							}
							break;
						}
					}					
				}else if(e["first"]["type"] == "multipol" && e["second"]["type"] == "multipol"){
					int num = 0;
					int v1, v2, id1, id2;
					for (auto& j : inf["multipoles"]) {
						if(j["id"] == e["first"]["id"]){
							for (auto& k : m) {
								if(j["name"] == k["name"]){
									for (auto& l : k["dangling_edges_mapping"]) {
										if(l[e["first"]["dangling_edge"]] != nullptr){
											id1 = j["id"];
											v1 = l[e["first"]["dangling_edge"]];
											num++;
											break;
										}	
									}
									break;
								}	
							}	
						}else if(j["id"] == e["second"]["id"]){									//nemam osetrene ze sa multipol spoji sam so sebou
							for (auto& k : m) {
								if(j["name"] == k["name"]){
									for (auto& l : k["dangling_edges_mapping"]) {
										if(l[e["second"]["dangling_edge"]] != nullptr){
											id2 = j["id"];
											v2 = l[e["second"]["dangling_edge"]];
											num++;
											break;
										}	
									}
									break;
								}	
							}
						}
						if(num==2){
							if(map[{ id1, v1 }] == 0){
								c++;
								map[{ id1, v1 }] = c;
							}
							if(map[{ id2, v2 }] == 0){
								c++;
								map[{ id2, v2 }] = c;
							}
							break;
						}	
					}	
					//add();
							
				}else if(e["first"]["type"] == "vertex" && e["second"]["type"] == "vertex"){
					addE(g, Location(map[{ 0, e["first"]["id"] }], map[{ 0, e["second"]["id"] }]));						
				}else{	
					string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
					const char * resp = str.c_str();
					send(new_socket, resp, strlen(resp), 0);			
				}
			}				
			//write_sparse6(g);*/
		
			string str="HTTPS/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 12\n\nHello world!";
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);
		}else if (request.uri.compare(0,12,"/favicon.ico")==0){
	
		}else if (request.uri.compare(0,6,"/close")==0){
			//break;//
		}else{
			string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);		
		}
	}else if(request.method == "GET"){
		if(request.uri.compare(0,9,"/multipol")==0){
			json m = datab_mult();
			std::string s = m.dump();//m.dump(4)
		
			string str="HTTPS/1.1 200 OK\nContent-Type: application/json\n\n" + s;
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);	
		}else if (request.uri.compare(0,12,"/favicon.ico")==0){
	
		}else if (request.uri.compare(0,6,"/close")==0){
			//break;//
		}else{
			string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);		
		}
	}	
	
    //}//
    return 0;
}





