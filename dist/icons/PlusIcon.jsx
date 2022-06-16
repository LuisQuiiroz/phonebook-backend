import * as React from "react"

const PlusIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-plus"
        {...props}
    >
        <path d="M12 5v14M5 12h14" />
    </svg>
)

export default PlusIcon
