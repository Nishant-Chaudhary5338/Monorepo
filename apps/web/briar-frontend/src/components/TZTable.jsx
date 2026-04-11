import React from "react";

const TZTable = () => {
  return (
    <table class='border border-[#b4ed47] p-2'>
      <thead>
        <tr>
          <th></th>
          <th class='border-r border-[#b4ed47]'></th>
          <th class='border-r border-[#b4ed47] sm:px-10'>Customer</th>
          <th>Base</th>
        </tr>
        <tr>
          <th class='border-r border-[#b4ed47] '>Date</th>
          <th class='border-r border-[#b4ed47]'>Timezone</th>
          <th class='border-r border-[#b4ed47]'>GMT</th>
          <th class='px-12'>GMT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class='border-b border-[#b4ed47] border-r sm:px-14 '>Entry</td>
          <td class='border-b border-[#b4ed47] border-r sm:px-14'>
            27/06/2023
          </td>
          <td class='border-b border-[#b4ed47] border-r sm:px-14 '>
            27/06/2023
          </td>
        </tr>
        <tr>
          <td class='border-b border-[#b4ed47] border-r '>Need By</td>
          <td class='border-b border-[#b4ed47] border-r '>Need</td>
          <td class='border-b border-[#b4ed47] border-r '>27/06/2023</td>
        </tr>
        <tr>
          <td class='border-b border-[#b4ed47] border-r '>Planned Date</td>
          <td class='border-b border-[#b4ed47] border-r '>Need</td>
          <td class='border-b border-[#b4ed47] border-r '>27/06/2023</td>
        </tr>
        <tr>
          <td class='border-b border-[#b4ed47] border-r '>Complete</td>
          <td class='border-b border-[#b4ed47] border-r '>Need</td>
          <td class='border-b border-[#b4ed47] border-r '>27/06/2023</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TZTable;
