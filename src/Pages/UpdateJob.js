import React, { useEffect, useState } from "react";
const UpdateJob = ({ selectedJob, handleClose }) => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  useEffect(() => {
    if (selectedJob) {
      console.log(selectedJob);
      if (selectedJob.jobList && selectedJob.jobList.Pipeline) {
        const pipelineData = {
          value: selectedJob.jobList.Pipeline._id,
          label: selectedJob.jobList.Pipeline.Name,
        };
        setselectedPipeline(pipelineData);
        console.log(pipelineData);
        // setPipelineId(selectedJob.jobList.Pipeline._id);
        // fetchPipelineDataid(selectedJob.jobList.Pipeline._id);
      }
    }
  }, [selectedJob]);

  // pipeline data
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setselectedPipeline] = useState();

  const handlePipelineChange = (selectedOptions) => {
    setselectedPipeline(selectedOptions);
    console.log(selectedOptions);
  };
  useEffect(() => {
    fetchPipelineData();
  }, []);
  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionpipeline = pipelineData.map((pipelineData) => ({
    value: pipelineData._id,
    label: pipelineData.pipelineName,
  }));
  return (
    <div>
      <div className="mt-3">
        <label className="job-input-label">Pipeline</label>
        <select
          className="w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedPipeline?.value || ""}
          onChange={(e) => {
            const opt = optionpipeline.find(o => o.value === e.target.value);
            if (opt) handlePipelineChange(opt);
          }}
        >
          <option value="">Pipeline</option>
          {optionpipeline.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-sm text-gray-700">edit job</p>
    </div>
  );
};

export default UpdateJob;
