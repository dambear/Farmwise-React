import React, { useEffect, useState } from "react"
import {
  fetchFarmerData,
  deleteFarmerData,
} from "../../service/firebase/farmerFunction"
import { getFImg } from "../../utils/weather/farmerUtils"
import FarmerPreview from "./FarmerPreview"
import UpdateFarmer from "./UpdateFarmer" // Import the UpdateFarmer component

import editimg from "../../static/farmer/edit.png"
import delimg from "../../static/farmer/delete.png"
import addimg from "../../static/farmer/add.png"
import AddFarmer from "./AddFarmer"

const NewFarmerTable = () => {
  const [farmerData, setFarmerData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFarmers, setFilteredFarmers] = useState([])
  const [showFarmerPreview, setShowFarmerPreview] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false)
  const [isUpdateFarmerModalOpen, setIsUpdateFarmerModalOpen] = useState(false)

  useEffect(() => {
    // Fetch farmerData using your existing fetchFarmerData function
    const fetchData = async () => {
      try {
        const data = await fetchFarmerData() // Assuming fetchFarmerData is already defined
        setFarmerData(data)
        setFilteredFarmers(data) // Initially set filteredFarmers to all data
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear()
    return age
  }

  const handleAdd = (farmer, e) => {
    // Open the UpdateFarmer modal when the edit button is clicked
    setIsAddFarmerModalOpen(true)
  }

  const closeAddFarmerModal = async () => {
    // Close the UpdateFarmer modal
    setIsAddFarmerModalOpen(false)

    
    const updatedData = await fetchFarmerData() // Assuming fetchFarmerData is already defined
    setFarmerData(updatedData)
    setFilteredFarmers(updatedData) // Initially set filteredFarmers to all data
  }

  const handleEdit = (farmer, e) => {
    e.stopPropagation()
    setSelectedFarmer(farmer)

    // Open the UpdateFarmer modal when the edit button is clicked
    setIsUpdateFarmerModalOpen(true)
  }

  const closeUpdateFarmerModal = async () => {
    // Close the UpdateFarmer modal
    setIsUpdateFarmerModalOpen(false)

    // Clear the selected farmer data
    setSelectedFarmer(null)

    const updatedData = await fetchFarmerData() // Assuming fetchFarmerData is already defined
    setFarmerData(updatedData)
    setFilteredFarmers(updatedData) // Initially set filteredFarmers to all data
  }

  const handleDelete = async (farmerId, e) => {
    e.stopPropagation()

    const confirmed = window.confirm(
      "Are you sure you want to delete this farmer?"
    )

    if (confirmed) {
      await deleteFarmerData(farmerId)

      const updatedData = await fetchFarmerData() // Assuming fetchFarmerData is already defined
      setFarmerData(updatedData)
      setFilteredFarmers(updatedData) // Initially set filteredFarmers to all data
    }
  }

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    // Filter the farmer data based on the search query
    const filtered = farmerData.filter((farmer) => {
      const fullName = `${farmer.first_name} ${farmer.last_name}`
      return fullName.toLowerCase().includes(query)
    })
    setFilteredFarmers(filtered)
  }

  // Function to handle row click
  const handleRowClick = (farmer) => {
    setSelectedFarmer(farmer)
    setShowFarmerPreview(true) // Show the FarmerPreview component
  }

  // Function to close the FarmerPreview component
  const closeFarmerPreview = () => {
    setShowFarmerPreview(false)
  }

  return (
    <div className="mx-8 py-6 ">
      <div className=" flex justify-between items-center">
        <div className="flex flex-row ">
          <input
            type="text"
            placeholder="Search by Full Name"
            className="border rounded-lg py-2 px-3 w-64 focus:outline-none focus:ring focus:border-blue-300"
            value={searchQuery}
            onChange={handleSearchChange} // Call the handleSearchChange function on input change
          />

          <button
            onClick={(e) => handleAdd()}
            className="bg-white text-green-500 border-[1px]  border-green-400 hover:bg-green-500 ml-8
                        flex hover:text-white font-sm py-1 pl-8 pr-2  rounded-3xl shadow-md shadow-green-500/40
                        transition duration-300 ease-in-out transform hover:scale-105"
          >
            <span className="font-semibold text-[14px] mt-[6.5px]">
              ADD NEW FARMER
            </span>{" "}
            <img className="w-6 ml-4 mt-[4px]" src={addimg} alt="" />
          </button>
        </div>
      </div>
      <div className="mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
        <div className="inline-block min-w-full shadow rounded-xl overflow-hidden">
          <table className="min-w-full leading-normal bg-white">
            <thead>
              <tr>
                <th className="py-3 px-6 text-center bg-[#AAFF00] text-[#333333] font-semibold uppercase tracking-wider">
                  Profile
                </th>

                <th className="py-3 px-6 text-center bg-[#AAFF00] text-[#333333] font-semibold uppercase tracking-wider">
                  Full Name
                </th>
                <th className="py-3 px-6 text-center bg-[#AAFF00] text-[#333333] font-semibold uppercase tracking-wider">
                  Age
                </th>
                <th className="py-3 px-6 text-center bg-[#AAFF00] text-[#333333] font-semibold uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="py-3 px-6 text-center bg-[#AAFF00] text-[#333333] font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.farmer_id}
                  className="hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(farmer)} // Call handleRowClick when row is clicked
                >
                  <td className="flex justify-center py-3">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={getFImg(farmer.farmer_profile)}
                      alt={farmer.farmer_profile}
                    />
                  </td>

                  <td className="text-center">{`${farmer.first_name} ${farmer.last_name}`}</td>
                  <td className="text-center">
                    {calculateAge(farmer.birthdate)}
                  </td>
                  <td className="text-center">{farmer.contact_number}</td>
                  <td className="text-center py-4 px-6">
                    <div className="flex flex-row justify-center">
                      <button
                        onClick={(e) => handleEdit(farmer, e)}
                        className="bg-white text-blue-500 border-[1px]  border-blue-400 hover:bg-blue-500 
                        flex hover:text-white font-sm py-1 pl-6 pr-2  rounded-3xl mr-2 shadow-md shadow-blue-500/40
                        transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <span className="font-semibold text-[14px] mt-[1.5px]">
                          UPDATE
                        </span>{" "}
                        <img
                          className="w-5 ml-2 mt-[1.5px]"
                          src={editimg}
                          alt=""
                        />
                      </button>

                      <button
                        onClick={(e) => handleDelete(farmer.farmer_id, e)}
                        className="bg-white text-red-500 border-[1px]  border-red-400 hover:bg-red-500 
                        flex hover:text-white font-sm py-1 pl-6 pr-2  rounded-3xl mr-2 shadow-md shadow-red-500/40
                        transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <span className="font-semibold text-[14px] mt-[1.5px]">
                          DELETE
                        </span>{" "}
                        <img
                          className="w-5 ml-2 mt-[1.5px]"
                          src={delimg}
                          alt=""
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showFarmerPreview && (
        <FarmerPreview
          selectedFarmer={selectedFarmer}
          onClose={closeFarmerPreview} // Pass the closeFarmerPreview function
          farmerData={farmerData}
          farmerId={selectedFarmer?.farmer_id} // Pass the selected farmer's ID
        />
      )}
      {isAddFarmerModalOpen && (
        <AddFarmer
          onSubmit={(updatedData) => {
            // Implement your logic for handling the update here, e.g., calling an API or updating state.
            // After handling the update, you can close the modal.
            // For now, we'll just log the updated data.
            console.log("Updated Farmer Data:", updatedData)

            closeAddFarmerModal()
          }}
          onClose={closeAddFarmerModal}
        />
      )}
      {isUpdateFarmerModalOpen && (
        <UpdateFarmer
          selectedFarmer={selectedFarmer}
          onSubmit={(updatedData) => {
            // Implement your logic for handling the update here, e.g., calling an API or updating state.
            // After handling the update, you can close the modal.
            // For now, we'll just log the updated data.
            console.log("Updated Farmer Data:", updatedData)

            closeUpdateFarmerModal()
          }}
          onClose={closeUpdateFarmerModal}
        />
      )}
    </div>
  )
}

export default NewFarmerTable