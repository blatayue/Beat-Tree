class Api::NeojsonsController < ApplicationController
  
  def show
    if params[:query_type] == 'predandprog'
      json = Neo4j::Session.query("MATCH (n:Track)-[r]-(n2:Track) WHERE n.track_spotify_id = '#{params[:node_id]}' RETURN type(r) AS type, startNode(r) AS startNode, endNode(r) as endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'origins'
      json = Neo4j::Session.query("MATCH p=(n:Track)-[r*]->(n2) WHERE n.track_spotify_id = '#{params[:node_id]}' AND NOT (n2)-[]->()  UNWIND r AS rel RETURN startNode(rel) AS startNode, endNode(rel) AS endNode, type(rel) AS type")
      render json: json, status: :ok
    elsif params[:query_type] == 'inspirations'
      json = Neo4j::Session.query("MATCH p=(n:Track)<-[r*]-(n2) WHERE n.track_spotify_id = '#{params[:node_id]}' AND NOT (n2)<-[]-()  UNWIND r AS rel RETURN startNode(rel) AS startNode, endNode(rel) AS endNode, type(rel) AS type")
      render json: json, status: :ok
    elsif params[:query_type] == 'subgraph'
      json = Neo4j::Session.query("MATCH p=(a:Track)-[r*]-() WHERE a.track_spotify_id = '#{params[:node_id]}' UNWIND r AS rel RETURN startNode(rel) AS startNode, type(rel) as type, endNode(rel) as endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'most-sampled'
      json = Neo4j::Session.query("MATCH (prog)-[r:SAMPLES]->(b:Track) WITH b, COUNT(prog) AS n ORDER BY n DESC LIMIT 5 MATCH (b)<-[r2:SAMPLES]-(c:Track) RETURN c AS startNode, type(r2) AS type, b AS endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'most-covered'
      json = Neo4j::Session.query("MATCH (prog)-[r:COVERS]->(b:Track) WITH b, COUNT(prog) AS n ORDER BY n DESC LIMIT 5 MATCH (b)<-[r2:COVERS]-(c:Track) RETURN c AS startNode, type(r2) AS type, b AS endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'most-remixed'
      json = Neo4j::Session.query("MATCH (prog)-[r:REMIXES]->(b:Track) WITH b, COUNT(prog) AS n ORDER BY n DESC LIMIT 5 MATCH (b)<-[r2:REMIXES]-(c:Track) RETURN c AS startNode, type(r2) AS type, b AS endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'lots-o-samples'
      json = Neo4j::Session.query("MATCH (a:Track)-[r:SAMPLES]->(pred) WITH a, COUNT(pred) AS n ORDER BY n DESC LIMIT 5 MATCH (a)-[r2:SAMPLES]->(c:Track) RETURN a AS startNode, type(r2) AS type, c AS endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'lone-nodes'
      json = Neo4j::Session.query("MATCH (a:Track) WHERE NOT (a)-[]-(:Track) RETURN a AS startNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'mother-o-drums'
      json = Neo4j::Session.query("MATCH (prog)-[r:SAMPLES {sample_type: 'Drums'}]->(b:Track) WITH b, COUNT(prog) AS n ORDER BY n DESC LIMIT 5 MATCH (b)<-[r2:SAMPLES]-(c:Track) RETURN c AS startNode, type(r2) AS type, b AS endNode")
      render json: json, status: :ok
    elsif params[:query_type] == 'popularity'
      json = Neo4j::Session.query("MATCH (a)-[r]->(b:Track) RETURN a AS startNode, type(r) AS type, b AS endNode ORDER BY a.track_popularity DESC LIMIT 5")
      render json: json, status: :ok
    elsif params[:query_type] == 'whole-graph'
      json = Neo4j::Session.query("MATCH ()-[r]->() RETURN type(r) as type, startNode(r) as startNode, endNode(r) as endNode")
      render json: json, status: :ok
    else
      render json: "Not Implemented", status: :not_implemented
    end
  end
  
  private
  
  def query_params
    params.require(:query_type, :node_id)
  end
  
end
