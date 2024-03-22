module Api
    module V1
      class Items::ItemsController < AuthenticatedController
        before_action -> {check_permissions( :Item, params[:action])}, only: [:index, :show, :create, :update, :destroy, :add_subcategory, :remove_subcategory] 
        before_action :set_item, only: %i[show update destroy fetch_containers add_subcategory remove_subcategory]
        before_action :set_subcategory, only: %i[add_subcategory remove_subcategory]
  
        def index
          items_per_page = 24
          # filter first by search term
          @items = params.has_key?(:q) ? Item.search_term(params[:q]) : Item.all

          # if subcategories or categories are selected filter by those as well
          if params.has_key?(:category_ids) || params.has_key?(:subcategory_ids)
            @items = @items&.in_categories(
              params.has_key?(:category_ids) ? params[:category_ids] : [],
              params.has_key?(:subcategory_ids) ? params[:subcategory_ids] : []
            )
          end

          total_items_count = @items.count

          # finally, paginate the results
          @items = @items.order(id: :desc).page(params[:page]).per(items_per_page)
          
          
          render json: {
              items: @items.map{ |item| augment_with_image(item)},
              total_count: total_items_count,
              per_page: items_per_page
          }
        end
  
        def show
          render json: augment_with_image(@item)
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

        def fetch_containers
          render json: @item.containments.map{|containment| containment.as_json.merge(container: augment_with_image(containment.container))}
        end

        def add_subcategory
          @item.subcategories << @subcategory
        end

        def remove_subcategory
          @item.subcategories.destroy @subcategory
        end
  
        private
  
        def set_item
          if ["add_subcategory","remove_subcategory"].include? params[:action]
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