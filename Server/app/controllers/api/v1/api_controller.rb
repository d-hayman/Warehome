module Api
    module V1
      class ApiController < ActionController::Base
        private
        def augment_with_image(record)
          if record.image.attached?
            record.as_json.merge(image_url: url_for(record.image))
          else
            record.as_json.merge(image_url: nil)
          end
        end
      end
    end
  end