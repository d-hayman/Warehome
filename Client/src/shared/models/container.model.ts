/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing container records
 */
class ContainerModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * ID of the parent container
     */
    parentId: string = '';
    /**
     * container name
     */
    name:string = '';
    /**
     * container description
     */
    description:string = '';
    /**
     * container notes
     */
    notes:string = '';
    /**
     * Number of containers directly within this container
     */
    children:number = 0;
    /**
     * item image url from response data
     */
    image_url:string = '';

    /**
     * Selected file populated in the form data when saving the item
     */
    image:File | undefined | null = null;

    /**
     * Parse response data to create a container model object
     * @param dataset raw response data
     * @returns The container as a strongly typed object, extracted from the response data
     */
    public static buildContainerData(dataset:any):ContainerModel {
        const container = new ContainerModel();
        container.id = dataset.id ?? '';
        container.parentId = dataset.parent_id ?? '';
        container.name = dataset.name ?? '';
        container.description = dataset.description ?? '';
        container.notes = dataset.notes ?? '';
        container.image_url = dataset.image_url ?? '';
        container.children = dataset.children ?? 0;
        return container;
    }

}

export {ContainerModel}