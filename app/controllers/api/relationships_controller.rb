class Api::RelationshipsController < ApplicationController
  
  def show
    @startNode = Track.find_by(track_spotify_id: params[:id])
    @endNode = Track.find_by(track_spotify_id: params[:endNodeId])
    type = params[:type]
    
    if type == "SAMPLES"
      @rel = Track.query_as(:t)
                  .match("t-[r:SAMPLES]->(t2)")
                  .where("t.track_spotify_id = '#{@startNode.track_spotify_id}' AND t2.track_spotify_id = '#{@endNode.track_spotify_id}'")
                  .pluck(:r).first
      if @startNode && @endNode && @rel
        render 'api/relationships/relationship', status: :ok
      else
        render json: ['Not Found'], status: :not_found
      end
    elsif type == "COVERS"
      @rel = Track.query_as(:t).match("t-[r:COVERS]->(t2)").where("t.track_spotify_id = '#{@startNode.track_spotify_id}' AND t2.track_spotify_id = '#{@endNode.track_spotify_id}'").pluck(:r).first
      if @startNode && @endNode && @rel
        render 'api/relationships/relationship', status: :ok
      else
        render json: ['Not Found'], status: :not_found
      end
    elsif type == "REMIXES"
      @rel = Track.query_as(:t).match("t-[r:REMIXES]->(t2)").where("t.track_spotify_id = '#{@startNode.track_spotify_id}' AND t2.track_spotify_id = '#{@endNode.track_spotify_id}'").pluck(:r).first
      if @startNode && @endNode && @rel
        render 'api/relationships/relationship', status: :ok
      else
        render json: ['Not Found'], status: :not_found
      end
    else
      render json: ['Not Found'], status: :not_found
    end
  end
  
  def update
    @startNode = Track.find_by(track_spotify_id: params[:id])
    @endNode = Track.find_by(track_spotify_id: params[:endNodeId])
    type = params[:type]
    @rel = Track.query_as(:t)
                .match("t-[r:#{type}]->(t2)")
                .where("t.track_spotify_id = '#{@startNode.track_spotify_id}' AND t2.track_spotify_id = '#{@endNode.track_spotify_id}'")
                .pluck(:r).first
    
    if @rel.added_by != current_user.username
      render json: ['Not authorized'], status: :not_authorized
      return
    end
    
    if type == "SAMPLES"
      if @rel.update(relationship_params)
        render 'api/relationships/relationship', status: :ok
      else
        render json: @rel.errors.full_messages, status: :unprocessable_entity
      end
    elsif type == "COVERS"
      @rel.notes = relationship_params[:notes]
      if @rel.save
        render 'api/relationships/relationship', status: :ok
      else
        render json: @rel.errors.full_messages, status: :unprocessable_entity
      end
    elsif type == "REMIXES"
      @rel.notes = relationship_params[:notes]
      if @rel.save
        render 'api/relationships/relationship', status: :ok
      else
        render json: @rel.errors.full_messages, status: :unprocessable_entity
      end
    else
      render json: ['Not Found'], status: :not_found
    end
  end
  
  def destroy
    @startNode = Track.find_by(track_spotify_id: params[:id])
    @endNode = Track.find_by(track_spotify_id: params[:endNodeId])
    type = params[:type]
    @rel = Track.query_as(:t)
                .match("t-[r:#{type}]->(t2)")
                .where("t.track_spotify_id = '#{@startNode.track_spotify_id}' AND t2.track_spotify_id = '#{@endNode.track_spotify_id}'")
                .pluck(:r).first
                
    if @rel
      if @rel.added_by == current_user.username
        @rel.destroy
        render json: ['Relationship destroyed.'], status: :ok
      else
        render json: ['You are not authorized to delete this relationship.'], status: :forbidden
      end
    else
      render json: ['This relationship was not found in the BeatTree Database'], status: :not_found
    end
  end
  
  private
  
  def relationship_params
    params.require(:relationship).permit(:sample_type, :added_by, :notes, :significance, :child_url,
                                         :parent_url, :child_start_time, :child_start_time, :parent_start_time)
  end
  
end