// export const generateCvContent = (cvData) => {
//     return `
//     <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
//       <div style="text-align: center;">
//         <img src="${cvData.avatarUrl}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%;" />
//         <h1>${cvData.name}</h1>
//         <h3 style="color: #555;">${cvData.title}</h3>
//       </div>

//       <hr style="border: 1px solid #ddd; margin: 20px 0;" />

//       <h2>Contact</h2>
//       <p><strong>Email:</strong> ${cvData.contact.email}</p>
//       <p><strong>Phone:</strong> ${cvData.contact.phone}</p>
//       <p><strong>Address:</strong> ${cvData.contact.address}</p>

//       <h2>Skills</h2>
//       <ul>
//         ${cvData.skills.map(skill => `<li>${skill}</li>`).join('')}
//       </ul>

//       <h2>Experience</h2>
//       ${cvData.experiences.map(exp => `
//         <div>
//           <h3>${exp.role} at ${exp.company}</h3>
//           <p><em>${exp.time}</em></p>
//           <p>${exp.desc}</p>
//         </div>
//       `).join('')}

//       <h2>Projects</h2>
//       ${cvData.projects.map(project => `
//         <div>
//           <h3>${project.name}</h3>
//           <p>${project.desc}</p>
//         </div>
//       `).join('')}

//       <h2>Education</h2>
//       ${cvData.education.map(edu => `
//         <div>
//           <h3>${edu.school}</h3>
//           <p>${edu.major} (${edu.year})</p>
//         </div>
//       `).join('')}
//     </div>
//   `;
// };

//------------------------mẫu 2---------------------------

// export const generateCvContent = (cvData) => {
//     return `
//     <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; display: flex; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
//       <!-- Sidebar -->
//       <div style="width: 35%; background: #4CAF50; color: #fff; padding: 20px;">
//         <div style="text-align: center;">
//           <img src="${cvData.avatarUrl}" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #fff;" />
//           <h1 style="font-size: 24px; margin: 10px 0 5px; text-transform: uppercase;">${cvData.name}</h1>
//           <h3 style="font-size: 16px; color: #e0e0e0;">${cvData.title}</h3>
//         </div>

//         <div style="margin-top: 20px;">
//           <h2 style="font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #fff; padding-bottom: 5px; margin-bottom: 10px;">Thông tin liên hệ</h2>
//           <p style="font-size: 14px;"><strong>Email:</strong> ${cvData.contact.email}</p>
//           <p style="font-size: 14px;"><strong>Điện thoại:</strong> ${cvData.contact.phone}</p>
//           <p style="font-size: 14px;"><strong>Địa chỉ:</strong> ${cvData.contact.address}</p>
//         </div>

//         <div style="margin-top: 20px;">
//           <h2 style="font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #fff; padding-bottom: 5px; margin-bottom: 10px;">Kỹ năng</h2>
//           <ul style="list-style-type: none; padding: 0;">
//             ${cvData.skills.map(skill => `<li style="font-size: 14px; margin-bottom: 5px;">• ${skill}</li>`).join('')}
//           </ul>
//         </div>
//       </div>

//       <!-- Main Content -->
//       <div style="width: 65%; padding: 20px;">
//         <h2 style="font-size: 18px; color: #4CAF50; text-transform: uppercase; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin-bottom: 15px;">Kinh nghiệm làm việc</h2>
//         ${cvData.experiences.map(exp => `
//           <div style="margin-bottom: 15px;">
//             <h3 style="font-size: 16px; font-weight: bold; color: #333;">${exp.role} - ${exp.company}</h3>
//             <p style="font-size: 14px; color: #777; font-style: italic;">${exp.time}</p>
//             <p style="font-size: 14px; color: #555;">${exp.desc}</p>
//           </div>
//         `).join('')}

//         <h2 style="font-size: 18px; color: #4CAF50; text-transform: uppercase; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin: 15px 0;">Dự án</h2>
//         ${cvData.projects.map(project => `
//           <div style="margin-bottom: 15px;">
//             <h3 style="font-size: 16px; font-weight: bold; color: #333;">${project.name}</h3>
//             <p style="font-size: 14px; color: #555;">${project.desc}</p>
//           </div>
//         `).join('')}

//         <h2 style="font-size: 18px; color: #4CAF50; text-transform: uppercase; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin: 15px 0;">Học vấn</h2>
//         ${cvData.education.map(edu => `
//           <div style="margin-bottom: 15px;">
//             <h3 style="font-size: 16px; font-weight: bold; color: #333;">${edu.school}</h3>
//             <p style="font-size: 14px; color: #555;">${edu.major} (${edu.year})</p>
//           </div>
//         `).join('')}
//       </div>
//     </div>
//   `;
// };



//------------------------mẫu 3---------------------------
export const generateCvContent = (cvData) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">

      <div style="display: flex; padding: 20px;">
        <!-- Left Section -->
        <div style="width: 40%;">
          <div style="text-align: center;">
            <img src="${cvData.avatarUrl}" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #0052CC;" />
          </div>

          <div style="margin-top: 20px;">
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Tên</h2>
            <p style="font-size: 14px; font-weight: bold; color: #333; text-transform: uppercase;">${cvData.name}</p>
            <p style="font-size: 14px; color: #555;">${cvData.title}</p>
          </div>

          <div style="margin-top: 20px;">
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Liên hệ</h2>
            <p style="font-size: 14px; color: #555;"><strong>Email:</strong> ${cvData.contact.email}</p>
            <p style="font-size: 14px; color: #555;"><strong>Điện thoại:</strong> ${cvData.contact.phone}</p>
            <p style="font-size: 14px; color: #555;"><strong>Địa chỉ:</strong> ${cvData.contact.address}</p>
          </div>

          <div style="margin-top: 20px;">
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Kỹ năng</h2>
            <ul style="list-style-type: none; padding: 0;">
              ${cvData.skills.map(skill => `<li style="font-size: 14px; color: #555; margin-bottom: 5px; display: flex; justify-content: space-between;"><span>${skill}</span></li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Right Section -->
        <div style="width: 60%; padding-left: 20px;">
          <div>
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Kinh nghiệm làm việc</h2>
            ${cvData.experiences.map(exp => `
              <div style="margin-bottom: 15px;">
                <p style="font-size: 14px; font-weight: bold; color: #333;">${exp.role}</p>
                <p style="font-size: 14px; color: #555;">${exp.company}, ${exp.time}</p>
                <p style="font-size: 14px; color: #555;">${exp.desc}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 20px;">
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Dự án cá nhân</h2>
            ${cvData.projects.map(project => `
              <div style="margin-bottom: 15px;">
                <p style="font-size: 14px; font-weight: bold; color: #333;">${project.name}</p>
                <p style="font-size: 14px; color: #555;">${project.desc}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 20px;">
            <h2 style="font-size: 16px; color: #0052CC; text-transform: uppercase; margin-bottom: 10px;">Học vấn</h2>
            ${cvData.education.map(edu => `
              <div style="margin-bottom: 15px;">
                <p style="font-size: 14px; font-weight: bold; color: #333;">${edu.school}</p>
                <p style="font-size: 14px; color: #555;">${edu.major}, ${edu.year}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};