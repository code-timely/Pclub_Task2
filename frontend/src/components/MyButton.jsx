export function MyButton({label, onClick}) {
    return <button onClick={onClick} type="button" className=" w-full text-white bg-emerald-600 hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
        {label}
        </button>
}