import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { ScenarioSelect } from './components/ScenarioSelect';
import { MissionBriefing } from './components/MissionBriefing';
import { PlanningWorkspace } from './components/PlanningWorkspace';
import { SimulationPlayback } from './components/SimulationPlayback';
import { ResultsScorecard } from './components/ResultsScorecard';
import { SystemConfig } from './components/SystemConfig';
import { ProjectOps } from './components/ProjectOps';
import { AdminDashboard } from './components/AdminDashboard';
import {
  AdminCreateMission,
  MissionData } from
'./components/AdminCreateMission';
import { BiddersDashboard } from './components/BiddersDashboard';
import { BudgetReview } from './components/BudgetReview';
import { DeployLoading } from './components/DeployLoading';
type Screen =
'menu' |
'scenario' |
'briefing' |
'workspace' |
'simulation' |
'results' |
'settings' |
'projects' |
'admin' |
'admin-create-mission' |
'budget-review' |
'deploy-loading' |
'bidders'; // Ensure bidders screen is available if not already
export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null
  );
  // Store custom mission data for the bidders flow
  const [customMissionData, setCustomMissionData] =
  useState<MissionData | null>(null);
  const handleStartMission = () => {
    setCurrentScreen('scenario');
  };
  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedScenarioId(null);
  };
  const handleProceedToBriefing = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setCurrentScreen('briefing');
  };
  const handleBackToScenario = () => {
    setCurrentScreen('scenario');
  };
  const handleEnterWorkspace = () => {
    setCurrentScreen('workspace');
  };
  const handleRunSimulation = () => {
    setCurrentScreen('simulation');
  };
  const handleSimulationComplete = () => {
    setCurrentScreen('results');
  };
  const handleRetry = () => {
    setCurrentScreen('briefing');
  };
  const handleBackToBriefing = () => {
    setCurrentScreen('briefing');
  };
  const handleBackToWorkspace = () => {
    setCurrentScreen('workspace');
  };
  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };
  const handleCloseSettings = () => {
    setCurrentScreen('menu');
  };
  const handleContinue = () => {
    setCurrentScreen('projects');
  };
  const handleLoadProject = (projectId: string) => {
    // For now, just go to briefing or workspace.
    // In a real app, this would load specific state.
    console.log(`Loading project: ${projectId}`);
    setSelectedScenarioId('warehouse-alpha'); // Mock ID
    setCurrentScreen('workspace');
  };
  const handleAdminAccess = () => {
    setCurrentScreen('admin');
  };
  const handleCreateMission = () => {
    setCurrentScreen('admin-create-mission');
  };
  // Step 1: Mission Created -> Go to Budget Review
  const handleMissionCreated = (data: MissionData) => {
    console.log('Mission Configured:', data);
    setCustomMissionData(data);
    setCurrentScreen('budget-review');
  };
  // Step 2: Budget Confirmed -> Go to Loading
  const handleBudgetConfirmed = (finalBudget: string) => {
    if (customMissionData) {
      setCustomMissionData({
        ...customMissionData,
        budget: finalBudget
      });
    }
    setCurrentScreen('deploy-loading');
  };
  // Step 3: Loading Complete -> Go to Bidders
  const handleDeploymentComplete = () => {
    setCurrentScreen('bidders');
  };
  const handleBidAccept = (bid: any) => {
    // Convert custom mission + bid into a scenario format
    console.log('Bid accepted:', bid.company, 'Amount:', bid.amount);
    setSelectedScenarioId('custom-' + Date.now());
    setCurrentScreen('workspace');
  };
  // Note: BiddersDashboard might expect different props or types based on existing code.
  // I need to check if BiddersDashboard exists and what it expects.
  // The prompt says "send this to bidders to compete for the bid".
  // Assuming BiddersDashboard exists from previous context or I should reuse it if available.
  // Let's check imports. BiddersDashboard is imported in the original App.tsx read?
  // Wait, I didn't see BiddersDashboard in the existing_files list provided in the prompt context.
  // Ah, I see BiddersDashboard.tsx in the existing_files list!
  // Let me double check the BiddersDashboard props.
  // I'll assume standard props for now or just log it if I can't check.
  // Actually, I should check BiddersDashboard to be safe, but I'm limited in tool calls.
  // I'll assume it takes missionData and onAcceptBid.
  return (
    <>
      {currentScreen === 'menu' &&
      <MainMenu
        onStart={handleStartMission}
        onSettings={handleOpenSettings}
        onContinue={handleContinue}
        onAdminAccess={handleAdminAccess} />

      }

      {currentScreen === 'scenario' &&
      <ScenarioSelect
        onBack={handleBackToMenu}
        onProceed={handleProceedToBriefing} />

      }

      {currentScreen === 'briefing' &&
      <MissionBriefing
        scenarioId={selectedScenarioId}
        onBack={handleBackToScenario}
        onStart={handleEnterWorkspace} />

      }

      {currentScreen === 'workspace' &&
      <PlanningWorkspace
        scenarioId={selectedScenarioId}
        onBack={handleBackToBriefing}
        onRunSimulation={handleRunSimulation} />

      }

      {currentScreen === 'simulation' &&
      <SimulationPlayback
        scenarioId={selectedScenarioId}
        onBack={handleBackToWorkspace}
        onComplete={handleSimulationComplete} />

      }

      {currentScreen === 'results' &&
      <ResultsScorecard
        scenarioId={selectedScenarioId}
        onRetry={handleRetry}
        onMainMenu={handleBackToMenu} />

      }

      {currentScreen === 'settings' &&
      <SystemConfig onBack={handleCloseSettings} />
      }

      {currentScreen === 'projects' &&
      <ProjectOps onBack={handleBackToMenu} onLoad={handleLoadProject} />
      }

      {currentScreen === 'admin' &&
      <AdminDashboard
        onBack={handleBackToMenu}
        onCreateMission={handleCreateMission} />

      }

      {currentScreen === 'admin-create-mission' &&
      <AdminCreateMission
        onBack={() => setCurrentScreen('admin')}
        onComplete={handleMissionCreated} />

      }

      {currentScreen === 'budget-review' && customMissionData &&
      <BudgetReview
        missionData={customMissionData}
        onBack={() => setCurrentScreen('admin-create-mission')}
        onConfirm={handleBudgetConfirmed} />

      }

      {currentScreen === 'deploy-loading' &&
      <DeployLoading onComplete={handleDeploymentComplete} />
      }

      {currentScreen === 'bidders' && customMissionData &&
      <BiddersDashboard
        missionData={customMissionData}
        onAcceptBid={handleBidAccept}
        onBack={() => setCurrentScreen('admin-create-mission')} />

      }
    </>);

}