"use client";
import TileComponent from "@/components/FormElements/TileComponent";
import { adminAddProductformControls, AvailableSizes } from "@/utils/index";
import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";

function handleImage() {
    
}
export default function AdminAddNewProduct() {
    return (
        <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                    <input accept="image/*"
                    max="1000000" type="file" onChange={handleImage}/>
                    <div className="flex gap-2 flex-col">
                        <label>Available sizes</label>
                        <TileComponent data={AvailableSizes} />
                    </div>
                    {
                        adminAddProductformControls.map((controlItem, idx) =>
                            controlItem.componentType === "input" ? (
                                <InputComponent
                                    key={controlItem.label || idx}
                                    type={controlItem.type}
                                    placeholder={controlItem.placeholder}
                                    label={controlItem.label}
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
                    <button className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-white">
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    )
}