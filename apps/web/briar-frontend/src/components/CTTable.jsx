import React from "react";

const CTTable = ({ data }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <p className='bg-teal-50 font-semibold px-4 py-1 my-2 w-40 text-center border border-[#b4ed47]'>
        Completion text
      </p>
      <table className='border border-[#b4ed47]'>
        <tbody>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Created By ID
            </td>
            <td className='py-2 sm:px-20'>{data?.CreatedBy}</td>
          </tr>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Created By Name
            </td>
            <td className='py-2 sm:px-20'>{data?.CreatedBy}</td>
          </tr>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Released by ID
            </td>
            <td className='py-2 sm:px-20'></td>
          </tr>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Released by Name
            </td>
            <td className='py-2 sm:px-20'></td>
          </tr>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Released By Date
            </td>
            <td className='py-2 sm:px-20'></td>
          </tr>
          <tr className='border-b border-[#b4ed47]'>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Completed By ID
            </td>
            <td className='py-2 sm:px-20'></td>
          </tr>
          <tr>
            <td className='py-2 px-4 border-r border-[#b4ed47]'>
              Completed by Name
            </td>
            <td className='py-2 sm:px-20'></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CTTable;
