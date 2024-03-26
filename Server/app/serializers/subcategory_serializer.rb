class SubcategorySerializer
    include JSONAPI::Serializer

    attributes :id, :name, :description
    belongs_to :category
end