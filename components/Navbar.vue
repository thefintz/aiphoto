<template>
	<Menubar :model="items" class="menubar border-none bg-gray-800">
		<template #item="slotProps">
			<a :href="slotProps.item.to" @click.prevent="handleClick(slotProps.item)" :class="[
				'block px-4 py-1',
				isActive(slotProps.item) ? 'text-sky-400 font-bold rounded' : 'text-gray-300'
			]">
				<i :class="slotProps.item.icon"></i>
				<span class="ml-2">{{ slotProps.item.label }}</span>
			</a>
		</template>
	</Menubar>
</template>

<script setup lang="ts">
const router = useRouter();
const { signIn, signOut, status } = useAuth();

type Item = {
	label?: any;
	icon?: any;
	command?: any;
	to?: string;
};

const HOME: Item = {
	label: "Home",
	icon: "pi pi-home",
	to: "/",
	command: () => router.push("/"),
};

const CREATEIMAGES: Item = {
	label: "Create Images",
	icon: "pi pi-images",
	to: "/createimages",
	command: () => router.push("/createimages"),
};

const CREATEMODEL: Item = {
	label: "Create Model",
	icon: "pi pi-palette",
	to: "/createmodel",
	command: () => router.push("/createmodel"),
};

const PROFILE: Item = {
	label: "Profile",
	icon: "pi pi-user",
	to: "/profile",
	command: () => router.push("/profile"),
};

const LOGIN: Item = {
	label: "Login",
	icon: "pi pi-sign-in",
	to: "/login",
	command: () => signIn("auth0"),
};

const LOGOUT: Item = {
	label: "Logout",
	icon: "pi pi-sign-out",
	to: "/logout",
	command: () => signOut({ callbackUrl: "/" }),
};

const items = ref<Item[]>([HOME, LOGIN]);
if (status.value === "authenticated") {
	items.value = [HOME, CREATEMODEL, CREATEIMAGES, PROFILE, LOGOUT];
}

const activeRoute = computed(() => router.currentRoute.value.path);

const isActive = (item: Item) => item.to === activeRoute.value;

const handleClick = (item: Item) => {
	if (item.command) {
		item.command();
	}
};
</script>