module Api
    module V1
      class Items::ItemsController < AuthenticatedController
        before_action -> {check_permissions( :Item, params[:action])}, only: [:index, :show, :create, :update, :destroy, :add_subcategory, :remove_subcategory] 
        before_action :set_item, only: %i[show update destroy add_subcategory remove_subcategory]
        before_action :set_subcategory, only: %i[add_subcategory remove_subcategory]
  
        def index
          @items = Item.all
          
          total_items_count = Item.count
          
          render json: {
              items: @items,
              total_count: total_items_count
          }
        end
  
        def show
          render json: @item
        end
  
        def create
          @item = Item.new(item_params)
  
          @item.creator = current_user
          
          if @item.save
              render json: @item
          else
              render json: @item.errors, status: :unprocessable_entity
          end
        end
          
        def update
          if @item.update(item_params)
            render json: @item
          else
            render json: @item.errors, status: :unprocessable_entity
          end
        end
          
        def destroy
          @item.destroy
        end

        def add_subcategory
          @item.subcategories << @subcategory
        end

        def remove_subcategory
          @item.subcategories.destroy @subcategory
        end
  
        private
  
        def set_item
          if params[:action].in? ("add_subcategory","remove_subcategory")
            @item = Item.find(params[:item_id])
          else
            @item = Item.find(params[:id])
          end
        end

        #only applicable to add_subcategory and remove_subcategory, otherwise :id is a item ID
        def set_subcategory
         @subcategory = Subcategory.find(params[:id])
        end
  
        def item_params
          params.require(:item).permit(:description, :notes, :image)
        end
      end
    end
  end