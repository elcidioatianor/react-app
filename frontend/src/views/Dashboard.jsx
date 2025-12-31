// Exemplo 1: Hook useFetch
import {useState} from 'react'
import { useApi, useFetch } from "../hooks/useApi";

// Toggle sidebar on mobile
function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('sidebar-mobile-show');
};

// Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const sidebar = document.querySelector('.sidebar');
            const toggleBtn = document.getElementById('sidebarToggle');
            /*
            if (window.innerWidth < 992 && 
                !sidebar.contains(event.target) && 
                !toggleBtn.contains(event.target) &&
                sidebar.classList.contains('sidebar-mobile-show')) {
                sidebar.classList.remove('sidebar-mobile-show');
            } */
        });

export function Dashboard() {
    return (
        <div className="container-fluid dark-mode p-0">
        {/* Sidebar */}
        <div className="sidebar d-none d-lg-block">
            <div className="p-4">
                {/* Logo */}
                <div className="text-center mb-5">
                    <div className="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle">
                        <svg width="35" height="30" viewBox="0 0 256 366" version="1.1">
                            <defs>
                                <linearGradient x1="12.5189534%" y1="85.2128611%" x2="88.2282959%" y2="10.0225497%" id="linearGradient-1">
                                    <stop stopColor="#FF0057" stopOpacity="0.16" offset="0%"></stop>
                                    <stop stopColor="#FF0057" offset="86.1354%"></stop>
                                </linearGradient>
                            </defs>
                            <g>
                                <path d="M0,60.8538006 C0,27.245261 27.245304,0 60.8542121,0 L117.027019,0 L255.996549,0 L255.996549,86.5999776 C255.996549,103.404155 242.374096,117.027222 225.569919,117.027222 L145.80812,117.027222 C130.003299,117.277829 117.242615,130.060011 117.027019,145.872817 L117.027019,335.28252 C117.027019,352.087312 103.404567,365.709764 86.5997749,365.709764 L0,365.709764 L0,117.027222 L0,60.8538006 Z" fill="#001B38"></path>
                                <circle fill="url(#linearGradient-1)" transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675)" cx="147.013244" cy="147.014675" r="78.9933938"></circle>
                                <circle fill="url(#linearGradient-1)" opacity="0.5" transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675)" cx="147.013244" cy="147.014675" r="78.9933938"></circle>
                            </g>
                        </svg>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className="nav flex-column">
                    <a className="nav-link active py-3 mb-2" href="#">
                        <i className="bi bi-house-door me-3"></i>
                        <span>Dashboard</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-briefcase me-3"></i>
                        <span>Projects</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-list-task me-3"></i>
                        <span>My Tasks</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-calendar me-3"></i>
                        <span>Calendar</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-clock me-3"></i>
                        <span>Time Manage</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-graph-up me-3"></i>
                        <span>Reports</span>
                    </a>
                    <a className="nav-link py-3 mb-2" href="#">
                        <i className="bi bi-gear me-3"></i>
                        <span>Settings</span>
                    </a>
                </nav>
            </div>
        </div>
        
        {/* Main Content */}
        <div className="main-content">
            {/* Header */}
            <header className="header px-4">
                <div className="d-flex align-items-center justify-content-between h-100">
                    {/* Mobile menu toggle */}
                    <button className="btn btn-outline-secondary d-lg-none" id="sidebarToggle" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                    
                    {/* Search */}
                    <div className="position-relative flex-grow-1 mx-3">
                        <i className="bi bi-search search-icon"></i>
                        <input type="text" className="form-control search-box ps-5" placeholder="Search"/>
                    </div>
                    
                    {/* User profile */}
                    <div className="dropdown">
                        <a href="#" className="d-block text-decoration-none dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown">
                            <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-circle" width="40" height="40"/>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li><a className="dropdown-item" href="#">Settings</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </header>
            
            {/* Content */}
            <div className="p-3 p-md-4">
                <div className="row g-4">
                    {/* Left Column */}
                    <div className="col-lg-6 col-xl-4">
                        {/* Google Card */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                            <img src="https://www.google.com/favicon.ico" alt="Google" width="24" height="24"/>
                                        </div>
                                        <div>
                                            <h5 className="card-title mb-0">Google</h5>
                                            <p className="text-muted mb-0">Google Inc.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <button className="btn btn-outline-secondary btn-sm me-2">
                                            <i className="bi bi-star"></i>
                                        </button>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="badge bg-light text-dark">PROGRESS</span>
                                    <span className="badge bg-danger">HIGH PRIORITY</span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Task done: <strong>25/50</strong></span>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-primary" style={{width: '50%'}}></div>
                                    </div>
                                </div>
                                
                                <div className="d-flex mb-4">
                                    <span className="badge bg-info bg-opacity-10 text-info me-2">IOS APP</span>
                                    <span className="badge bg-primary bg-opacity-10 text-primary">UI/UX</span>
                                </div>
                                
                                <div className="d-flex mb-3">
                                    <div className="avatar-group">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                    </div>
                                </div>
                                
                                <span className="badge bg-warning bg-opacity-10 text-warning">
                                    DUE DATE: 18 JUN
                                </span>
                            </div>
                        </div>
                          {/* Slack Card */}
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                                            <img src="https://www.slack.com/favicon.ico" alt="Slack" width="24" height="24"/>
                                        </div>
                                        <div>
                                            <h5 className="card-title mb-0">Slack</h5>
                                            <p className="text-muted mb-0">Slack corporation</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <button className="btn btn-outline-secondary btn-sm me-2">
                                            <i className="bi bi-star"></i>
                                        </button>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success">COMPLETED</span>
                                    <span className="badge border border-success text-success">MEDIUM PRIORITY</span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Task done: <strong>50/50</strong></span>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-success w-100"></div>
                                    </div>
                                </div>
                                
                                <div className="d-flex mb-4">
                                    <span className="badge bg-info bg-opacity-10 text-info me-2">IOS APP</span>
                                    <span className="badge bg-warning bg-opacity-10 text-warning">ANDROID</span>
                                </div>
                                
                                <div className="d-flex mb-3">
                                    <div className="avatar-group">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                        <img src="https://via.placeholder.com/40" className="rounded-circle" alt="User"/>
                                    </div>
                                </div>
                                
                                <span className="badge bg-warning bg-opacity-10 text-warning">
                                    DUE DATE: 18 JUN
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Middle Column */}
                    <div className="col-lg-6 col-xl-4">
                        {/* Tasks Card */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    My Tasks
                                    <span className="text-muted">(05)</span>
                                </h5>
                                
                                <ul className="list-unstyled mb-0">
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">01</span>
                                            <span>Create wireframe</span>
                                        </div>
                                        <i className="bi bi-check-circle text-muted"></i>
                                    </li>
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">02</span>
                                            <span>Dashboard design</span>
                                            <span className="badge bg-light text-dark ms-3">
                                                <i className="bi bi-chat me-1"></i>3
                                            </span>
                                            <span className="badge bg-light text-dark ms-2">
                                                <i className="bi bi-people me-1"></i>3
                                            </span>
                                        </div>
                                        <i className="bi bi-check-circle text-muted"></i>
                                    </li>
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">03</span>
                                            <span>Components card</span>
                                            <span className="badge bg-light text-dark ms-3">
                                                <i className="bi bi-chat me-1"></i>3
                                            </span>
                                        </div>
                                        <i className="bi bi-check-circle text-muted"></i>
                                    </li>
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">04</span>
                                            <span className="text-decoration-line-through">Google logo design</span>
                                        </div>
                                        <i className="bi bi-check-circle-fill text-success"></i>
                                    </li>
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">05</span>
                                            <span className="text-decoration-line-through">Header navigation</span>
                                        </div>
                                        <i className="bi bi-check-circle-fill text-success"></i>
                                    </li>
                                    <li className="task-item py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">06</span>
                                            <span>International</span>
                                            <span className="badge bg-light text-dark ms-3">
                                                <i className="bi bi-chat me-1"></i>3
                                            </span>
                                            <span className="badge bg-light text-dark ms-2">
                                                <i className="bi bi-people me-1"></i>3
                                            </span>
                                        </div>
                                        <i className="bi bi-check-circle text-muted"></i>
                                    </li>
                                    <li className="py-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted me-3">07</span>
                                            <span>Production data</span>
                                        </div>
                                        <i className="bi bi-check-circle text-muted"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Timer Card */}
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <h6 className="card-title mb-0">Google</h6>
                                    <button className="btn btn-outline-secondary btn-sm">
                                        <i className="bi bi-play"></i>
                                    </button>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 border-start border-primary border-4">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-alarm text-primary me-2"></i>
                                        <span>Create wireframe</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">25 min 20s</span>
                                        <button className="btn btn-primary btn-sm">
                                            <i className="bi bi-pause"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <h6 className="card-title mb-0">Slack</h6>
                                    <button className="btn btn-outline-secondary btn-sm">
                                        <i className="bi bi-play"></i>
                                    </button>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-alarm me-2"></i>
                                        <span>International</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-3">30 min</span>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="bi bi-play"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-alarm me-2"></i>
                                        <span>Slack logo design</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-3">30 min</span>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="bi bi-play"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center p-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-alarm me-2"></i>
                                        <span>Dashboard template</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-3">30 min</span>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <i className="bi bi-play"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-12 col-xl-4">
                        {/* Calendar Card */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title mb-0">Dec 2021</h5>
                                    <div className="d-flex">
                                        <button className="btn btn-primary btn-sm rounded-circle me-2">
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <button className="btn btn-primary btn-sm rounded-circle">
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="table-responsive">
                                    <table className="table table-borderless text-center">
                                        <thead>
                                            <tr>
                                                <th>S</th>
                                                <th>M</th>
                                                <th>T</th>
                                                <th>W</th>
                                                <th>T</th>
                                                <th>F</th>
                                                <th>S</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-muted">
                                                <td>25</td>
                                                <td>26</td>
                                                <td>27</td>
                                                <td>28</td>
                                                <td>29</td>
                                                <td>30</td>
                                                <td className="text-dark">1</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td className="calendar-day event blue">3</td>
                                                <td>4</td>
                                                <td>5</td>
                                                <td>6</td>
                                                <td>7</td>
                                                <td className="calendar-day event yellow">8</td>
                                            </tr>
                                            <tr>
                                                <td>9</td>
                                                <td>10</td>
                                                <td>11</td>
                                                <td>12</td>
                                                <td className="calendar-day today">13</td>
                                                <td>14</td>
                                                <td>15</td>
                                            </tr>
                                            <tr>
                                                <td>16</td>
                                                <td>17</td>
                                                <td>18</td>
                                                <td>19</td>
                                                <td>20</td>
                                                <td>21</td>
                                                <td>22</td>
                                            </tr>
                                            <tr>
                                                <td>23</td>
                                                <td>24</td>
                                                <td className="calendar-day event red">25</td>
                                                <td>26</td>
                                                <td>27</td>
                                                <td>28</td>
                                                <td>29</td>
                                            </tr>
                                            <tr>
                                                <td>30</td>
                                                <td>31</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        {/* Messages Card */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Messages</h5>
                                
                                <div className="message-item d-flex align-items-center mb-4">
                                    <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="User"/>
                                    <div>
                                        <h6 className="mb-0">Charlie Rabiller</h6>
                                        <p className="text-muted mb-0 small">Hey John! Do you read the NextJS doc?</p>
                                    </div>
                                </div>
                                
                                <div className="message-item d-flex align-items-center mb-4">
                                    <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="User"/>
                                    <div>
                                        <h6 className="mb-0">Marie Lou</h6>
                                        <p className="text-muted mb-0 small">No I think the dog is better...</p>
                                    </div>
                                </div>
                                
                                <div className="message-item d-flex align-items-center mb-4">
                                    <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="User"/>
                                    <div>
                                        <h6 className="mb-0">Ivan Buck</h6>
                                        <p className="text-muted mb-0 small">Seriously? haha Bob is not a child!</p>
                                    </div>
                                </div>
                                
                                <div className="message-item d-flex align-items-center">
                                    <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="User"/>
                                    <div>
                                        <h6 className="mb-0">Marina Farga</h6>
                                        <p className="text-muted mb-0 small">Do you need that design?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
	);
}
