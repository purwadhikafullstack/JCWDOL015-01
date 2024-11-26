const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-500 via-sky-500 to-teal-500 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-lg font-semibold">OntoEmployee</p>
                        <p>© {new Date().getFullYear()} All Rights Reserved</p>
                    </div>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="text-white hover:text-blue-200 transition"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-white hover:text-blue-200 transition"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="text-white hover:text-blue-200 transition"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
