<h2>Computer Science Final Year Thesis Project</h2>
<h6>UCLan Cyprus</h6>

<p>Foodboot is a Web Platform running on Cloud. Its main purpose is to work as an assistive tool for nutritionists and clients. The Web Platform is orchestrated by three applications that run in different modes (Admin, Nutritionist, Client) depending on the role. Each application is composed of three main components. A cloud-operating <strong>MySQL</strong> database hosted in Heroku, the <strong>Frontend</strong> written mostly in ReactJS and the <strong>Backend</strong> where RESTful API architecture was used for the platform's logic and web services written in NodeJS. As a starting template for the Frontend, the CoreUI admin panel is used. For Authentication and user's info, the platform integrates Auth0 (SaaS service). The project is hosted on GitHub.</p>

<a>https://foodboot.netlify.app/</a>
</br>
<a>https://foodboot-backend.herokuapp.com/</a>
  
<h4>Pages</h4>
<p>
  <ul>
    <li>/dashboard</li>
    <li>/profile</li>
      <ul>
        <li>/edit-profile</li>
       </ul>
    <li>/personal-calendar</li>
    <li>/clients</li>
      <ul>
        <li>/clients/create-client</li>      
        <li>/clients/view-client?id=:id</li>
        <li>/clients/edit-client?id=:id</li>
      </ul>
    <li>/meal-plans</li>
      <ul>
        <li>/meal-plans/update-meal-plan?id=:id</li>      
        <li>/meal-plans/view-meal-plan?id=:id</li>
      </ul>
    <li>/nutrition-facts</li>
    <li>/analytics</li>
    </ul>
</p>

<h4>Features</h4>
<p>
  <h6>Client</h6>
  <ul>
    <li>CRUD operations for client</li>
    <li>Search engine for clients table</li>
    <li>Import/Export clients in .csv format</li>        <li>/edit-profile</li>

    <li>CRUD operations for Food Preferences of each client</li>
    <li>CRUD operations for Medical History Record of each client</li>
    <li>Print Client's Card</li>
  </ul>
    
  <h6>Calendar</h6>
  <ul>
    <li>View Calendar modes (day, week, month | list)</li>
    <li>CRUD operations for calendar events</li>
  </ul>

   <h6>Meal Plan</h6>
      <ul>
        <li>View Meal Plans as Cards Table</li>
        <li>Search engine for Meal Plans Table</li>
        <li>CRUD operations for Meal Plans</li>
        <li>Side Navbar that fetches and displays all client's info when Update</li>
      </ul>
</p>

<h4>REST API calls</h4>
<p>
  <h6>Client</h6>
  <ol>
    <li>GET    /clients</li>
    <li>GET    /clients/:id</li> 
    <li>POST   /clients/create</li>
    <li>PUT    /clients/update/:id</li>
    <li>DELETE /clients/delete/:id</li>
  </ol>
  
  <h6>Medical History</h6>
    <ol>
      <li>GET    /clients/medical-histories/:id</li>
      <li>PUT    /clients/medical-histories/update/:id</li>
      <li>DELETE /clients/medical-histories/delete/:id</li>
    </ol>

  <h6>Food Preferences</h6>
    <ol>
      <li>GET    /clients/food-preferences/:id</li>
      <li>PUT    /clients/food-preferences/update/:id</li>
      <li>DELETE /clients/food-preferences/delete/:id</li>
    </ol>

  <h6>Food Options</h6>
    <ol>
      <li>GET    /food-options</li>
      <li>POST   /food-options/create</li>
      <li>DELETE /food-options/delete/:id</li>
    </ol>

  <h6>Calendar</h6>
    <ol>
      <li>GET    /calendars</li>
      <li>GET    /calendars/:user</li>
      <li>POST   /calendars/create</li>
      <li>DELETE /calendars/delete</li>
    </ol>

  <h6>Calendar Events</h6>
    <ol>
      <li>GET    /calendars/calendar-events/:user</li>
      <li>POST   /calendars/calendar-events/create</li>
      <li>PUT    /calendars/calendar-events/update/:id</li>
      <li>DELETE /calendars/calendar-events/delete/:id</li>
    </ol>

  <h6>Meal Plans</h6>
    <ol>
      <li>GET    /meal-plans</li>
      <li>GET    /meal-plans/:id</li>
      <li>PUT    /meal-plans/update</li>
      <li>DELETE /meal-plans/delete/:id</li>
    </ol>
</p>
