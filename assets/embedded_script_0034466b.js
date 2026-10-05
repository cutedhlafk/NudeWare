(function(){
const root=$.GetContextPanel();
if(!root)return;
if(typeof InventoryAPI==='undefined')return;
if(typeof GameInterfaceAPI==='undefined'||typeof GameInterfaceAPI.GetSettingString!=='function')return;

const panelId='%s';
const containerId='%s';
const textureName='%s';
const itemId=BigInt('%llu');
const yaw=%f;
const pitch=%f;
const captureStickerSlot=%d;

if(!InventoryAPI.IsValidItemID(itemId))return;

function fp(id){
	var x=root.FindChild(id);
	if(!x&&root.FindChildTraverse)x=root.FindChildTraverse(id);
	if(!x&&root.FindChildInLayoutFile)x=root.FindChildInLayoutFile(id);
	return x;
}

['%s','%s','VelocityWeaponPreviewV3','VelocityWeaponPreviewV3_container','VelocityWeaponPreviewV2','VelocityWeaponPreviewV1'].forEach(function(id){
	var old=fp(id);if(old){try{old.DeleteAsync(0);}catch(e){}}
});

const container=$.CreatePanel('Panel',root,containerId,{
	hittest:false,
	style:'width: %upx; height: %upx; opacity: 0.01; brightness: 0.0; wash-color: #00000000; x: 0px; y: 0px; z-index: -99999;'
});
if(!container)return;
container.hittest=false;
container.hittestchildren=false;

function getMapName(){
	let mapName=GameInterfaceAPI.GetSettingString('ui_inspect_bkgnd_map');
	if(!mapName||mapName==='mainmenu')mapName=GameInterfaceAPI.GetSettingString('ui_mainmenu_bkgnd_movie');
	if(!mapName)mapName='de_dust2';
	if(!mapName.endsWith('_vanity'))mapName=mapName+'_vanity';
	return mapName;
}

const mapName=getMapName();
const panel=$.CreatePanel('MapItemPreviewPanel',container,panelId,{
	'require-composition-layer':'true',
	'composition-layer-texture-name':textureName,
	'transparent-background':'false',
	'disable-depth-of-field':'false',
	hide_while_waiting_for_composite_materials:'true',
	'pin-fov':'vertical',
	camera:'cam_default',
	player:'true',
	map:mapName,
	initial_entity:'item',
	mouse_rotate:'false',
	rotation_limit_x:'360',
	rotation_limit_y:'90',
	auto_rotate_x:'0',
	auto_rotate_y:'0',
	panzoom_enabled:'true',
	style:'width: 100%%; height: 100%%; opacity: 1.0;'
});
if(!panel){try{container.DeleteAsync(0.0);}catch(e){}return;}

panel.hittest=false;
panel.hittestchildren=false;
try{if(typeof panel.SetRenderInterval==='function')panel.SetRenderInterval(1);}catch(e){}
try{panel.SetHideStaticGeometry(true);panel.SetHideParticles(true);panel.SetTransparentBackground(true);}catch(e){}
panel.Data().loadedMap=mapName;
try{panel.SetReadyForDisplay(false);}catch(e){}

if(captureStickerSlot>=0){
	try{
		if(typeof InventoryAPI.PreviewStickerInModelPanel==='function'){
			InventoryAPI.PreviewStickerInModelPanel(String(itemId),captureStickerSlot,panel);
		}
	}catch(e){}
}

panel.Data().itemId=itemId;
panel.Data().active_item_idx=0;
try{panel.SetActiveItem(0);panel.SetItemItemId(itemId,'');}catch(e){}
try{panel.SetRotation(yaw,pitch,0.0);}catch(e){}
try{panel.SetRotation(yaw,pitch);}catch(e){}
try{panel.FireEntityInput('item','SetAngles',String(pitch)+' '+String(yaw)+' 0');}catch(e){}
try{panel.SetReadyForDisplay(true);}catch(e){}

for(let i=0;i<=10;i++){
	const suffix=i===0?'':String(i);
	if(i!==0){
		try{panel.FireEntityInput('light_item'+suffix,'Disable');}catch(e){}
		try{panel.FireEntityInput('light_item_new'+suffix,'Disable');}catch(e){}
	}else{
		try{panel.FireEntityInput('light_item_new','Disable');}catch(e){}
	}
}

try{
	const category=InventoryAPI.GetLoadoutCategory(itemId);
	if(category==='secondary')panel.SetCSMSplitPlane0DistanceOverride(30.0);
	else if(category==='smg')panel.SetCSMSplitPlane0DistanceOverride(40.0);
	else if(category==='rifle')panel.SetCSMSplitPlane0DistanceOverride(55.0);
}catch(e){}

function getWeaponCamera(){
	let defName='';
	try{defName=InventoryAPI.GetItemDefinitionName(itemId);}catch(e){}
	const cameras={
		weapon_awp:'7',weapon_aug:'3',weapon_sg556:'4',weapon_ssg08:'6',
		weapon_ak47:'4',weapon_m4a1_silencer:'6',weapon_famas:'4',weapon_g3sg1:'5',
		weapon_galilar:'3',weapon_m4a1:'4',weapon_scar20:'5',weapon_mp5sd:'3',
		weapon_xm1014:'4',weapon_m249:'6',weapon_ump45:'3',weapon_bizon:'3',
		weapon_mag7:'3',weapon_nova:'5',weapon_sawedoff:'3',weapon_negev:'5',
		weapon_usp_silencer:'2',weapon_elite:'2',weapon_tec9:'2',weapon_revolver:'2',
		weapon_c4:'3',weapon_taser:'0'
	};
	if(cameras[defName]!==undefined)return cameras[defName];
	let category='';
	try{category=InventoryAPI.GetLoadoutCategory(itemId);}catch(e){}
	if(category==='secondary')return '0';
	if(category==='smg')return '2';
	return '3';
}

try{panel.TransitionToCamera('cam_'+getWeaponCamera(),0);}catch(e){}
})();