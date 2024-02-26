module Api
    module V1
      class Containers::ContainersController < AuthenticatedController
        before_action -> {check_permissions( :Container, params[:action])}, only: [:index, :show, :create, :update, :destroy, :add_item, :remove_item] 
        before_action :set_container, only: %i[show update destroy add_item remove_item]
        before_action :set_item, only: %i[add_item remove_item]
  
        def index
          @containers = Container.all
          
          total_containers_count = Container.count
          
          render json: {
              containers: @containers,
              total_count: total_containers_count
          }
        end
  
        def show
          render json: @container
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

        def add_item
          containment = @container.containments.new(containment_params)
          containment.item = @item
          if containment.save
            render json: containment
          else
            render json: containment.errors, status: :unprocessable_entity
          end
        end

        def remove_item
          @container.items.destroy @item
        end
  
        private
  
        def set_container
          if params[:action].in? ("add_item","remove_item")
            @container = Container.find(params[:container_id])
          else
            @container = Container.find(params[:id])
          end
        end

        #only applicable to add_item and remove_item, otherwise :id is a container ID
        def set_item
         @item = Item.find(params[:id])
        end
  
        def container_params
          params.require(:container).permit(:description, :notes, :position, :parent_id, :image)
        end

        def containment_params
          params.require(:containment).permit(:quantity, :position)
        end
      end
    end
  end