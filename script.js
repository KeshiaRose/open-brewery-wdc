/* global tableau */

let myConnector = tableau.makeConnector();

myConnector.getSchema = function(schemaCallback) {
  const columns = [
    { id: "id", alias: "ID", dataType: tableau.dataTypeEnum.int },
    { id: "name", alias: "Name", dataType: tableau.dataTypeEnum.string },
    {
      id: "brewery_type",
      alias: "Brewery Type",
      dataType: tableau.dataTypeEnum.string
    },
    { id: "street", alias: "Street", dataType: tableau.dataTypeEnum.string },
    { id: "city", alias: "City", dataType: tableau.dataTypeEnum.string },
    { id: "state", alias: "State", dataType: tableau.dataTypeEnum.string },
    {
      id: "postal_code",
      alias: "Postal Code",
      dataType: tableau.dataTypeEnum.string
    },
    { id: "country", alias: "Country", dataType: tableau.dataTypeEnum.string },
    {
      id: "longitude",
      alias: "Longitude",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "latitude",
      alias: "Latitude",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "phone",
      alias: "Phone Number",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "website_url",
      alias: "Website URL",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "updated_at",
      alias: "Last Updated At",
      dataType: tableau.dataTypeEnum.string
    }
  ];

  const tableSchema = {
    id: "OpenBreweryDB",
    alias: tableau.connectionData + " Breweries",
    columns: columns
  };

  schemaCallback([tableSchema]);
};

myConnector.getData = async function(table, doneCallback) {
  let tableData = [];
  let state = tableau.connectionData;
  let morePages = true;
  let page = 1;

  while (morePages) {
    let url = `https://api.openbrewerydb.org/breweries?page=${page}&per_page=50&by_state=${state}`;
    let data = await fetch(url).then(response => response.json());

    if (data.length > 0) {
      for (let brewery of data) {
        tableData.push({
          id: brewery.id,
          name: brewery.name,
          brewery_type: brewery.brewery_type,
          street: brewery.street,
          city: brewery.city,
          state: brewery.state,
          postal_code: brewery.postal_code,
          country: brewery.country,
          longitude: brewery.longitude,
          latitude: brewery.latitude,
          phone: brewery.phone,
          website_url: brewery.website_url,
          updated_at: brewery.updated_at
        });
      }
      page++;
    } else {
      morePages = false;
    }
  }

  table.appendRows(tableData);
  doneCallback();
};

tableau.registerConnector(myConnector);
window._tableau.triggerInitialization &&
  window._tableau.triggerInitialization(); // Make sure WDC is initialized properly

function submit() {
  tableau.connectionData = document.getElementById("state").value;
  tableau.connectionName = "Open Brewery DB";
  tableau.submit();
}
