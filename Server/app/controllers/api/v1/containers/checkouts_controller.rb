module Api
    module V1
      class Containers::CheckoutsController < AuthenticatedController
        before_action -> {check_permissions( :Checkout, params[:action])} 
        before_action :set_containment
        before_action :set_checkout, only: %i[destroy]
  
        # def index
        #   @containers = Container.all
          
        #   total_containers_count = Container.count
          
        #   render json: {
        #       containers: @containers,
        #       total_count: total_containers_count
        #   }
        # end
  
        # def show
        #   render json: @container
        # end
  
        def create
          @checkout = @containment.checkouts.new(checkout_params)
  
          @checkout.user = current_user
          
          if @checkout.save
              render json: @checkout
          else
              render json: @checkout.errors, status: :unprocessable_entity
          end
        end
          
        # def update
        #   if @container.update(container_params)
        #     render json: @container
        #   else
        #     render json: @container.errors, status: :unprocessable_entity
        #   end
        # end
          
        def destroy
          @checkout.destroy
        end
  
        private
  
        def set_containment
          @containment =  Containment.find_by(container_id:params[:container_id], item_id:params[:item_id])
        end

        def set_checkout
          @checkout = @containment.checkouts.find(params[:id])
        end
  
        def checkout_params
          params.require(:checkout).permit(:quantity)
        end
      end
    end
  end