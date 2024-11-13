import React from 'react';
import ScrollToTop from "react-scroll-to-top";
import { IoIosArrowUp } from 'react-icons/io';

export default function ScrollButton() {
    return (
        <ScrollToTop 
            smooth
            component={<IoIosArrowUp className="h-6 w-6 text-white" />}
            className="flex items-center justify-center btn-gradient !rounded-full !p-3"
        />
    );
}