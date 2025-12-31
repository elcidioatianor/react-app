export { default as Rocket } from 'react-bootstrap-icons/dist/icons/rocket';
export { default as Search } from 'react-bootstrap-icons/dist/icons/search';
export { default as PersonCircle } from 'react-bootstrap-icons/dist/icons/person-circle';
export { default as Gear } from 'react-bootstrap-icons/dist/icons/gear';
export { default as BoxArrowRight } from 'react-bootstrap-icons/dist/icons/box-arrow-right';
export { default as GraphUp } from 'react-bootstrap-icons/dist/icons/graph-up';
export { default as ShieldCheck } from 'react-bootstrap-icons/dist/icons/shield-check';
export { default as ArrowsFullscreen } from 'react-bootstrap-icons/dist/icons/arrows-fullscreen';
export { default as Phone } from 'react-bootstrap-icons/dist/icons/phone';
export { default as CheckCircle } from 'react-bootstrap-icons/dist/icons/check-circle';
export { default as ArrowRepeat } from 'react-bootstrap-icons/dist/icons/arrow-repeat';
export { default as Star } from 'react-bootstrap-icons/dist/icons/star';
export { default as People } from 'react-bootstrap-icons/dist/icons/people';
export { default as Award } from 'react-bootstrap-icons/dist/icons/award';
export { default as ChevronRight } from 'react-bootstrap-icons/dist/icons/chevron-right';
export { default as Clock } from 'react-bootstrap-icons/dist/icons/clock';
export { default as Lock } from 'react-bootstrap-icons/dist/icons/lock';
export { default as Cpu } from 'react-bootstrap-icons/dist/icons/cpu';
export { default as Heart } from 'react-bootstrap-icons/dist/icons/heart';
export { default as Trophy } from 'react-bootstrap-icons/dist/icons/trophy';
export { default as Lightning } from 'react-bootstrap-icons/dist/icons/lightning';
export { default as Palette } from 'react-bootstrap-icons/dist/icons/palette';
export { default as Globe } from 'react-bootstrap-icons/dist/icons/globe';
export { default as Envelope } from 'react-bootstrap-icons/dist/icons/envelope';
export { default as Facebook } from 'react-bootstrap-icons/dist/icons/facebook';
export { default as Chat } from 'react-bootstrap-icons/dist/icons/chat';
export { default as Instagram } from 'react-bootstrap-icons/dist/icons/instagram';
export { default as Linkedin } from 'react-bootstrap-icons/dist/icons/linkedin';
export { default as Twitter } from 'react-bootstrap-icons/dist/icons/twitter';
export { default as Github } from 'react-bootstrap-icons/dist/icons/github';
export { default as PlayCircle } from 'react-bootstrap-icons/dist/icons/play-circle';
export { default as ShieldFill } from 'react-bootstrap-icons/dist/icons/shield-fill';
export { default as Calendar } from 'react-bootstrap-icons/dist/icons/calendar';
export { default as MapPin } from 'react-bootstrap-icons/dist/icons/map-fill'; //MapPin
export { default as Share } from 'react-bootstrap-icons/dist/icons/share';
export { default as Download } from 'react-bootstrap-icons/dist/icons/download';
export { default as Edit } from 'react-bootstrap-icons/dist/icons/pencil'; //Edit
export { default as Trash } from 'react-bootstrap-icons/dist/icons/trash';
export { default as Plus } from 'react-bootstrap-icons/dist/icons/plus';
export { default as Check } from 'react-bootstrap-icons/dist/icons/check';
export { default as X } from 'react-bootstrap-icons/dist/icons/x';
export { default as Upload } from 'react-bootstrap-icons/dist/icons/upload';
export { default as Bell } from 'react-bootstrap-icons/dist/icons/bell';
export { default as Shield } from 'react-bootstrap-icons/dist/icons/shield';
export { default as CreditCard } from 'react-bootstrap-icons/dist/icons/credit-card';
export { default as Activity } from 'react-bootstrap-icons/dist/icons/activity';
export { default as BarChart } from 'react-bootstrap-icons/dist/icons/bar-chart';
export { default as FileText } from 'react-bootstrap-icons/dist/icons/file-text';
export { default as Bookmark } from 'react-bootstrap-icons/dist/icons/bookmark';
export { default as Message } from 'react-bootstrap-icons/dist/icons/chat'; //Message 
export { default as Building } from 'react-bootstrap-icons/dist/icons/building';
export { default as Briefcase } from 'react-bootstrap-icons/dist/icons/briefcase';
export { default as GraduationCap } from 'react-bootstrap-icons/dist/icons/snapchat'; //GraduationCap
export { default as Link } from 'react-bootstrap-icons/dist/icons/link';
/*export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
export { default as  } from 'react-bootstrap-icons/dist/icons/';
*/

export function Camera(className, color='currentColor', size) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className={className} viewBox="0 0 16 16">
  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
</svg>
	)
}

export function EyeFill({color, width, height}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={ width } height={ height }fill={color} viewBox="0 0 16 16">
			<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
			<path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
		</svg>
	)
}
export function CartCheckFill({color, size, className}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-cart-check-fill" viewBox="0 0 16 16">
  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708"/>
</svg>
	)
}
export function ShieldLockFill({size, color, className}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
</svg>)
}
export function GeoAltFill({size, color, className}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>
	)
}
export function EyeSlashFill({color, width, height}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={ width } height={ height }fill={color} viewBox="0 0 16 16">
			<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
			<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
		</svg>
	)
}

export function React({size, className}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className={className} width={size} height={size} preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="currentColor" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
	)
}