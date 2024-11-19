export const Footer = () => {
  return (
    <footer className="py-6 bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 OntoEmployee. All rights reserved.</p>
        <p>
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};
