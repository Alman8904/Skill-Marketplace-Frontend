import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function SearchProviders({ onProviderSelect }) {

  const [searchForm, setSearchForm] = useState({
    skill: "",
    minRate: "",
    maxRate: "",
    serviceMode: "",
    minExperience: ""
  });

  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("skill", searchForm.skill);

      if (searchForm.minRate) params.append("minRate", searchForm.minRate);
      if (searchForm.maxRate) params.append("maxRate", searchForm.maxRate);
      if (searchForm.serviceMode) params.append("serviceMode", searchForm.serviceMode);
      if (searchForm.minExperience) params.append("minExperience", searchForm.minExperience);

      const data = await authFetch(`/user-skills/search?${params.toString()}`);
      setProviders(data.content || []);
      setMessage(data.content?.length ? "" : "No providers found");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Search failed");
    }
  };

  return (
    <div className="card">
      <h3>Search Skill Providers</h3>

      <form onSubmit={handleSearch} className="mb-lg">
        <div className="grid grid-cols-2 gap-md mb-md">
          <input
            name="skill"
            placeholder="Skill name (required)"
            value={searchForm.skill}
            onChange={handleChange}
            required
            className="col-span-2"
          />

          <input
            name="minRate"
            type="number"
            placeholder="Min Rate"
            value={searchForm.minRate}
            onChange={handleChange}
          />

          <input
            name="maxRate"
            type="number"
            placeholder="Max Rate"
            value={searchForm.maxRate}
            onChange={handleChange}
          />

          <select
            name="serviceMode"
            value={searchForm.serviceMode}
            onChange={handleChange}
          >
            <option value="">Any Mode</option>
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>

          <input
            name="minExperience"
            type="number"
            placeholder="Min Experience (years)"
            value={searchForm.minExperience}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">Search</button>
      </form>

      {message && <p className="message message-info">{message}</p>}

      {providers.length > 0 && (
        <div>
          <h4>Search Results ({providers.length})</h4>
          {providers.map((provider) => (
            <div key={`${provider.id}-${provider.skillName}`} className="card bg-hover mb-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-primary">{provider.username} <small className="text-muted">(ID: {provider.id})</small></h4>
                  <p className="text-lg"><b>{provider.skillName}</b></p>
                  <p className="text-muted">{provider.description}</p>
                </div>
                <div className="flex flex-col items-end gap-sm text-right">
                  <div>
                    <p className="text-xl"><b>${provider.rate}/hr</b></p>
                    <p className="text-muted text-sm">{provider.experience} years exp</p>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="status-badge status-accepted">{provider.serviceMode}</span>
                    <button
                      className="btn-primary py-xs px-md text-sm"
                      onClick={() => onProviderSelect && onProviderSelect(provider)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}