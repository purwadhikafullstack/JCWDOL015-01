// // components/UserProfile.tsx
// import React from 'react';
// import { calculateAge } from '../utils/ageCount';

// interface UserProfileProps {
//   user: {
//     id: number;
//     name: string;
//     birth_date: Date;
//     // Add other user fields as necessary
//   };
// }

// const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
//   const age = calculateAge(user.birth_date);

//   return (
//     <div>
//       <h2>{user.name}</h2>
//       <p>Age: {age}</p>
//       {/* Render other user details here */}
//     </div>
//   );
// };

// export default UserProfile;
