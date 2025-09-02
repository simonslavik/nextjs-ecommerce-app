"use client";
import TileComponent from "@/components/FormElements/TileComponent";
import { adminAddProductformControls, AvailableSizes } from "@/utils/index";
import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import { firebaseConfig } from "@/utils/index";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseStorageURL } from "@/utils/index";
import { useState } from "react";
import { addNewProduct } from "@/services/product";
import { GlobalContext } from "@/context";
import { set } from "mongoose";
import { toast } from "react-toastify";
import { useContext } from "react";
import Notification from "@/components/Notification";
import ComponentLevelLoader from "@/components/Loader";


const createUniqueFileName = (getFile)=> {
    const timestamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);

    return `${getFile.name}-${timestamp}-${randomStringValue}`; 
}

async function helperForUploadingImageToFirebase(file) {
    const getFileName = createUniqueFileName(file);
    const storageRef = ref(storage, `ecommerce/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadImage.on("state_changed", (snapshot)=> {}, (error)=>{
            console.log(error);
            reject(error);
        }, ()=>{
            getDownloadURL(uploadImage.snapshot.ref).then((downloadURL)=>{
                resolve(downloadURL);
            }).catch(error=>reject(error))
        })
    })
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);
;



const initialFormData = {
    name : "",
    price: 0,
    description: "",
    category: "men",
    sizes: [],
    deliveryInfo: "",
    onSale: "no",
    priceDrop: 0,
};

export default function AdminAddNewProduct() {
    
    const [formData, setFormData] = useState(initialFormData);

    const {componentLevelLoader, setComponentLevelLoader} = useContext(GlobalContext)



    async function handleImage(event) {
        console.log(event.target.files[0]);
        const extractImageUrl = await helperForUploadingImageToFirebase(event.target.files[0]);
        console.log(extractImageUrl);


        if(extractImageUrl !== ""){
            setFormData({...formData, imageUrl: extractImageUrl});
        }
    }
    
    function handleTileClick(getCurrentItem) {
        
        
        let cpySizes = [...formData.sizes];
        const index = cpySizes.findIndex((item)=> item.id === getCurrentItem.id);
        if(index === -1){
            cpySizes.push(getCurrentItem);
        } else {
            cpySizes = cpySizes.filter((item)=> item.id !== getCurrentItem.id);
        }
        setFormData({...formData, sizes: cpySizes});
    }
    
    async function handleAddProduct() {
        setComponentLevelLoader(true);
        const res = await addNewProduct(formData);
        console.log(res);

        if(res.success) {
            setComponentLevelLoader(false);
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            setComponentLevelLoader(false);
        }
    }
    
    console.log(formData);
    return (
        <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                    <input accept="image/*"
                    max="1000000" type="file" onChange={handleImage}/>
                    <div className="flex gap-2 flex-col">
                        <label>Available sizes</label>
                        <TileComponent selected={formData.sizes} onClick={handleTileClick} data={AvailableSizes} />
                    </div>
                    {
                        adminAddProductformControls.map((controlItem, idx) =>
                            controlItem.componentType === "input" ? (
                                <InputComponent
                                    key={controlItem.label || idx}
                                    type={controlItem.type}
                                    placeholder={controlItem.placeholder}
                                    label={controlItem.label}
                                    onChange={(event)=> setFormData({...formData, [controlItem.id]: event.target.value})}
                                />
                            ) : controlItem.componentType === "select" ? (
                                <SelectComponent
                                    key={controlItem.label || idx}
                                    label={controlItem.label}
                                    options={controlItem.options}
                                />
                            ) : null
                        )
                    }
                    <button onClick={handleAddProduct} className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-white cursior-pointer hover:bg-gray-800">
                        {
                            componentLevelLoader && componentLevelLoader === true ? (
                                <ComponentLevelLoader text={"Adding Product..."} color={"#ffffff"} loading={componentLevelLoader && componentLevelLoader === true} />
                            ) : null
                        }
                        Add Product
                    </button>
                </div>
            </div>
            <Notification/>
        </div>
    )
}