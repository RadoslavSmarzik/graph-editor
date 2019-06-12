
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
	
	Graph g = createG();       	//moze to tak byt ? chcel som v konstruktore //&g
	json inf;
	json m;
	vector<int> used_mult;
	std::map<pair<int, int>, Number> map;//Number, neda sa davat ++
	Number c = 0;//Number, moze byt aj int skusal som
	int new_socket;
	
	public:
	GraphBuilder(json data, int n_s){
		m = datab_mult();
		inf = data;
		new_socket = n_s;
	}
	
	Graph make_graph(){
		for (auto& e : inf["vertices"]) {
			c = c + 1;
			int n = std::stoi(e.get<std::string>());
			map[{ 0, n }] = c;
			addV(g, c);
		}
		for (auto& e : inf["edges"]) {
			if(e["first"]["type"] == "multipol" && e["second"]["type"] == "vertex"){
				json fid = e["first"]["id"];
				std::string fde = e["first"]["dangling_edge"].get<std::string>();
				std::string sid = e["second"]["id"].get<std::string>();
				m_v(fid, fde, sid);
			}else if(e["second"]["type"] == "multipol" && e["first"]["type"] == "vertex"){
				json sid = e["second"]["id"];
				std::string sde = e["second"]["dangling_edge"].get<std::string>();
				std::string fid = e["first"]["id"].get<std::string>();
				v_m(sid, sde, fid);
			}else if(e["first"]["type"] == "multipol" && e["second"]["type"] == "multipol"){
				json fid = e["first"]["id"];
				std::string fde = e["first"]["dangling_edge"].get<std::string>();
				json sid = e["second"]["id"];
				std::string sde = e["second"]["dangling_edge"].get<std::string>();
				m_m(fid, fde, sid, sde);
			}else if(e["first"]["type"] == "vertex" && e["second"]["type"] == "vertex"){
				std::string fid = e["first"]["id"].get<std::string>();
				std::string sid = e["second"]["id"].get<std::string>();
				v_v(fid, sid);
			}else{	
				string str="HTTPS/1.1 404 NOT FOUND\nContent-Type: text/html\n\n<html><body>NOT FOUND</body></html>";
				const char * resp = str.c_str();
				send(new_socket, resp, strlen(resp), 0);			
			}
		}
		return g;
	}
	
	void m_v(json fid, std::string fde, std::string sid){
		int v1, v2, id1;
		for (auto& j : inf["multipoles"]) {
			if(j["id"] == fid){
				for (auto& k : m) {
					if(j["name"] == k["name"]){
						for (auto& l : k["dangling_edges_mapping"]) {
							if(l[fde] != nullptr){
								id1 = std::stoi(j["id"].get<std::string>());
								v1 = std::stoi(l[fde].get<std::string>());
								v2 = std::stoi(sid);
								if(std::find(used_mult.begin(), used_mult.end(), id1) == used_mult.end()){
									used_mult.push_back(id1); 
									Graph multipol = read_sparse6(k["underlying_graph"].get<std::string>().begin(), k["underlying_graph"].get<std::string>().end());
									int n = min_offset(g);
									add_graph(g, multipol, n);              //opytat sa lebo vracia nieco
								}	
								if(map[{ id1, v1 }] == 0){
									c = c + 1;
									int n = min_offset(g);					//opytat sa
									map[{ id1, v1 }] = c + n;
								}
								identify_vertices(g, map[{ 0, v2 }], map[{ id1, v1 }]);  //opytat sa lebo vracia nieco
								break;
							}	
						}
						break;
					}	
				}
				break;
			}
		}
	}
	
	void v_m(json sid, std::string sde, std::string fid){
		int v1, v2, id1;
		for (auto& j : inf["multipoles"]) {
			if(j["id"] == sid){
				for (auto& k : m) {
					if(j["name"] == k["name"]){
						for (auto& l : k["dangling_edges_mapping"]) {
							if(l[sde] != nullptr){
								id1 = std::stoi(j["id"].get<std::string>());
								v1 = std::stoi(l[sde].get<std::string>());
								v2 = std::stoi(fid);
								if(std::find(used_mult.begin(), used_mult.end(), id1) == used_mult.end()){
									used_mult.push_back(id1); 
									Graph multipol = read_sparse6(k["underlying_graph"].get<std::string>().begin(), k["underlying_graph"].get<std::string>().end());
									int n = min_offset(g);
									add_graph(g, multipol, n);              //opytat sa lebo vracia nieco
								}	
								if(map[{ id1, v1 }] == 0){
									c = c + 1;
									int n = min_offset(g);//
									map[{ id1, v1 }] = c + n;
								}
								identify_vertices(g, map[{ 0, v2 }], map[{ id1, v1 }]);
								break;
							}	
						}							
						break;
					}	
				}
				break;
			}
		}
	}
	
	void m_m(json fid, std::string fde, json sid, std::string sde){
		int num = 0;
		int v1, v2, id1, id2;
		std::string m1, m2;
		for (auto& j : inf["multipoles"]) {
			if(j["id"] == fid){
				for (auto& k : m) {
					if(j["name"] == k["name"]){
						for (auto& l : k["dangling_edges_mapping"]) {
							if(l[fde] != nullptr){
								id1 = std::stoi(j["id"].get<std::string>());
								v1 = std::stoi(l[fde].get<std::string>());
								m1 = k["underlying_graph"].get<std::string>();
								num++;
								break;
							}	
						}
						break;
					}	
				}	
			}
			if(j["id"] == sid){
				for (auto& k : m) {
					if(j["name"] == k["name"]){
						for (auto& l : k["dangling_edges_mapping"]) {
							if(l[sde] != nullptr){
								id2 = std::stoi(j["id"].get<std::string>());
								v2 = std::stoi(l[sde].get<std::string>());
								m2 = k["underlying_graph"].get<std::string>();
								num++;
								break;
							}	
						}
						break;
					}	
				}
			}
			if(num==2){
				if(std::find(used_mult.begin(), used_mult.end(), id1) == used_mult.end()){
					used_mult.push_back(id1); 
					Graph multipol = read_sparse6(m1.begin(), m2.end());
					int n = min_offset(g);
					add_graph(g, multipol, n);              //opytat sa lebo vracia nieco
				}
				if(std::find(used_mult.begin(), used_mult.end(), id2) == used_mult.end()){
					used_mult.push_back(id2); 
					Graph multipol = read_sparse6(m2.begin(), m2.end());
					int n = min_offset(g);
					add_graph(g, multipol, n);              //opytat sa lebo vracia nieco
				}
				if(map[{ id1, v1 }] == 0){
					c = c + 1;
					int n = min_offset(g);///
					map[{ id1, v1 }] = c + n;
				}
				if(map[{ id2, v2 }] == 0){
					c = c + 1;
					int n = min_offset(g);///
					map[{ id2, v2 }] = c + n;
				}
				break;
			}	
		}
		identify_vertices(g, map[{ id1, v1 }], map[{ id2, v2 }]);		///
		suppress_vertex(g, map[{ id1, v1 }]);							// volaco vracia
	}
	
	void v_v(std::string fid, std::string sid){
		int v1 = std::stoi(fid);
		int v2 = std::stoi(sid);
		addE(g, Location(map[{ 0, v1 }], map[{ 0, v2 }]));		//chceme aj do opacnej strany?	
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
	//json inf = json::parse(data);
	
	if(request.method == "POST"){
		if(request.uri.compare(0,6,"/graph")==0){
			/*GraphBuilder gb(inf, new_socket);
			Graph g = gb.make_graph();
			
			std::string s =	write_sparse6(g);
		
			string str="HTTPS/1.1 200 OK\nContent-Type: text/plain\n\n" + s;
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);*/
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
			std::string s = m.dump();
					
			string str="HTTPS/1.1 200 OK\nContent-Type: application/json\n\n" + s;
			const char * resp = str.c_str();
			send(new_socket, resp, strlen(resp), 0);	
		}else if (request.uri.compare(0,11,"/invariants")==0){
			
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





