module Api
    module V1
      class Containers::ContainersController < AuthenticatedController
        before_action -> {check_permissions( :Container, params[:action])}
        before_action :set_container, only: %i[show update destroy fetch_items add_item remove_item]
        before_action :set_item, only: %i[add_item remove_item]
        before_action :set_containment, only: %i[fetch_item update_item]
  
        def index
          @containers = params.has_key?(:parent) ? Container.children_of(params[:parent]) : Container.top_level
          
          total_containers_count = @containers.count
          
          render json: {
              containers: @containers.map{ |container| augment_with_image(container).as_json.merge(children: container.children.count)},
              total_count: total_containers_count
          }
        end
  
        def show
          render json: augment_with_image(@container)
        end
  
        def create
          @container = Container.new(container_params)
  
          @container.creator = current_user
          
          if @container.save
              render json: @container
          else
              render json: @container.errors, status: :unprocessable_entity
          end
        end
          
        def update
          if @container.update(container_params)
            render json: @container
          else
            render json: @container.errors, status: :unprocessable_entity
          end
        end
          
        def destroy
          @container.destroy
        end

        def fetch_items
          render json: {
            items: @container.containments.map{|containment| containment.as_json.merge(item: augment_with_image(containment.item))}
          }
        end

        def fetch_item
          render json: @containment.as_json.merge(container: augment_with_image(@containment.container))
        end

        def add_item
          containment = @container.containments.new(containment_params)
          containment.item = @item
          if containment.save
            render json: containment
          else
            render json: containment.errors, status: :unprocessable_entity
          end
        end

        def update_item
          if @containment.update(containment_params)
            render json: @containment
          else
            render json: @containment.errors, status: :unprocessable_entity
          end
        end

        def remove_item
          @container.items.destroy @item
        end
  
        private
  
        def set_container
          if ["fetch_items","add_item","remove_item","update_item"].include? params[:action]
            @container = Container.find(params[:container_id])
          else
            @container = Container.find(params[:id])
          end
        end

        #only applicable to add_item and remove_item, otherwise :id is a container ID
        def set_item
         @item = Item.find(params[:id])
        end
  
        def set_containment
          @containment =  Containment.find_by(container_id:params[:container_id], item_id:params[:id])
        end
  
        def container_params
          params.require(:container).permit(:name, :description, :notes, :parent_id, :image)
        end

        def containment_params
          params.require(:containment).permit(:quantity, :position)
        end
      end
    end
  end