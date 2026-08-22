import type { AdminDashboardData } from "./types/admin";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { AdminHeader } from "./components/AdminHeader";
import { AdminSidebar } from "./components/AdminSidebar";
import { WorldDashboard } from "./components/WorldDashboard";
import { CombatDashboard } from "./components/CombatDashboard";

function AdminDashboardApp({ data }: { data: AdminDashboardData }) {
  const dashboard = useAdminDashboard(data);
  const { state, derived, actions } = dashboard;

  return (
    <div className="gods:h-full gods:flex gods:flex-col gods:bg-background gods:text-foreground gods:font-[family-name:var(--font-body)] gods:overflow-hidden">
      <div
        aria-hidden
        className="gods:pointer-events-none gods:fixed gods:inset-0 gods:z-[500] gods:opacity-[.045] gods:mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <AdminHeader
        groupes={data.groupes || []}
        activeGroupId={state.activeGroupId}
        onGroupChange={actions.handleGroupChange}
      />

      <div className="gods:flex gods:flex-1 gods:min-h-0">
        <AdminSidebar
          activeSection={state.activeSection}
          onSectionChange={actions.setActiveSection}
          scenes={state.scenes}
          sceneId={state.sceneId}
          onSceneChange={actions.switchScene}
          onNewScene={actions.newScene}
          onDeleteScene={actions.deleteScene}
          combatantCount={derived.combatantCount}
        />

        <main className="gods:flex-1 gods:min-w-0 gods:overflow-hidden gods:p-3 lg:gods:p-4">
          {state.activeSection === "world" ? (
            <div className="gods:h-full gods:overflow-y-auto">
              <WorldDashboard
                world={state.world}
                groupes={data.groupes || []}
                activeGroupId={state.activeGroupId}
                saveState={state.saveState}
                onChange={actions.updateWorld}
                onSave={actions.saveWorld}
              />
            </div>
          ) : (
            <CombatDashboard
              // AJOUT ICI : On fait passer l'ID du groupe au Dashboard de combat
              activeGroupId={state.activeGroupId}
              onUpdateNpcData={actions.updateNpcData}
              sceneId={state.sceneId}
              scenes={state.scenes}
              combatants={state.combatants}
              missingPCs={derived.missingPCs}
              log={state.log}
              pnjDiff={state.pnjDiff}
              bestId={state.bestId}
              npcName={state.npcName}
              threat={state.threat}
              experience={state.experience}
              role={state.role}
              specialty={state.specialty}
              customNpcId={state.customNpcId}
              customCarac={state.customCarac}
              customSkill={state.customSkill}
              customModifier={state.customModifier}
              attacker={state.attacker}
              target={state.target}
              attackRoll={state.attackRoll}
              defenseRoll={state.defenseRoll}
              weapon={state.weapon}
              customWeapon={state.customWeapon}
              adversaries={data.adversaries || []}

              onRestorePc={actions.restorePc}
              onClearEnemies={actions.clearEnemies}
              onSortInitiative={actions.sortInitiativeOrder}
              onDifficultyChange={actions.setPnjDiff}
              onRollInitiative={actions.rollNpcInitiative}

              onBestIdChange={actions.setBestId}
              onAddBestiary={actions.addBestiaryNpc}
              onNpcNameChange={actions.setNpcName}
              onThreatChange={actions.setThreat}
              onExperienceChange={actions.setExperience}
              onRoleChange={actions.setRole}
              onSpecialtyChange={actions.setSpecialty}
              onQuickNpc={actions.addQuickNpc}

              onCustomNpcIdChange={actions.setCustomNpcId}
              onCustomCaracChange={actions.setCustomCarac}
              onCustomSkillChange={actions.setCustomSkill}
              onCustomModifierChange={actions.setCustomModifier}
              onCustomRoll={actions.rollCustom}

              onRemove={actions.removeCombatant}
              onWound={actions.changeWound}
              onInit={actions.updateInit}
              onArmor={actions.updateArmor}
              onQuickRoll={actions.quickRoll}

              onAttackerChange={actions.setAttacker}
              onTargetChange={actions.setTarget}
              onAttackRollChange={actions.setAttackRoll}
              onDefenseRollChange={actions.setDefenseRoll}
              onWeaponChange={actions.setWeapon}
              onCustomWeaponChange={actions.setCustomWeapon}
              onResolveAttack={actions.resolveAttack}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardApp;