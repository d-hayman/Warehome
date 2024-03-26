class ItemSerializer
    include JSONAPI::Serializer

    attributes :id, :description, :notes
    has_many :subcategories
end