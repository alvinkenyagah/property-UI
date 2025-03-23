const Footer = () => {
    return (
      <footer className="bg-dark text-light mt-10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">AccommodateApp</h3>
              <p className="text-sm mt-1">Finding your perfect home.</p>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-4">
              <a href="#" className="text-sm hover:text-primary mb-2 md:mb-0">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-primary mb-2 md:mb-0">
                Terms of Service
              </a>
              <a href="#" className="text-sm hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} AccommodateApp. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;